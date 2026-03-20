-- =============================================
-- VidCraft AI — Supabase Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================

-- =============================================
-- 1. Profiles (extends auth.users)
-- =============================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  name            text,
  avatar_url      text,
  plan            text not null default 'free'
                  check (plan in ('free', 't1', 't2')),
  credits         int not null default 30,
  stripe_customer_id      text unique,
  stripe_subscription_id  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_stripe on public.profiles(stripe_customer_id);

-- =============================================
-- 2. Projects
-- =============================================
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  mode            text not null default 'template'
                  check (mode in ('template', 'creative', 'quick')),
  script_data     jsonb,
  creative_code   text,
  status          text not null default 'draft'
                  check (status in ('draft','scripted','rendering','completed','failed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_projects_user on public.projects(user_id);

-- =============================================
-- 3. Renders
-- =============================================
create table if not exists public.renders (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  user_id         uuid not null references public.profiles(id),
  status          text not null default 'queued'
                  check (status in ('queued','rendering','completed','failed')),
  output_url      text,
  resolution      text not null default '1080p',
  credits_used    int not null default 0,
  lambda_id       text,
  error_message   text,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists idx_renders_user on public.renders(user_id);
create index if not exists idx_renders_project on public.renders(project_id);

-- =============================================
-- 4. Credit Logs (audit trail)
-- =============================================
create table if not exists public.credit_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id),
  action          text not null,
  credits         int not null,
  balance         int not null,
  project_id      uuid references public.projects(id),
  description     text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_credit_logs_user on public.credit_logs(user_id);

-- =============================================
-- 5. Transactions (Stripe payments)
-- =============================================
create table if not exists public.transactions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id),
  type              text not null check (type in ('subscription','topup','refund')),
  amount            numeric(10,2) not null,
  credits           int not null,
  stripe_payment_id text,
  created_at        timestamptz not null default now()
);

create index if not exists idx_transactions_user on public.transactions(user_id);

-- =============================================
-- 6. Row Level Security
-- =============================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.renders enable row level security;
alter table public.credit_logs enable row level security;
alter table public.transactions enable row level security;

-- Profiles: users see/edit own
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Projects: users CRUD own
create policy "projects_all_own" on public.projects
  for all using (auth.uid() = user_id);

-- Renders: users see own
create policy "renders_select_own" on public.renders
  for select using (auth.uid() = user_id);
create policy "renders_insert_own" on public.renders
  for insert with check (auth.uid() = user_id);

-- Credit logs: users see own
create policy "credit_logs_select_own" on public.credit_logs
  for select using (auth.uid() = user_id);

-- Transactions: users see own
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

-- Service role needs full access (used by Stripe webhook via admin client)
grant all on public.profiles to service_role;
grant all on public.projects to service_role;
grant all on public.renders to service_role;
grant all on public.credit_logs to service_role;
grant all on public.transactions to service_role;

-- =============================================
-- 7. Auto-create profile on signup
-- Handles both Google OAuth and email signup
-- Uses email as the unique link between auth methods
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    name = coalesce(
      excluded.name,
      public.profiles.name
    ),
    avatar_url = coalesce(
      excluded.avatar_url,
      public.profiles.avatar_url
    ),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- 8. Deduct credits (atomic, prevents over-spend)
-- =============================================
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount int,
  p_action text,
  p_project_id uuid default null,
  p_description text default null
) returns int as $$
declare
  v_balance int;
begin
  select credits into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if v_balance is null then
    raise exception 'User not found';
  end if;

  if v_balance < p_amount then
    raise exception 'Insufficient credits: have %, need %', v_balance, p_amount;
  end if;

  update public.profiles
  set credits = credits - p_amount, updated_at = now()
  where id = p_user_id;

  v_balance := v_balance - p_amount;

  insert into public.credit_logs (user_id, action, credits, balance, project_id, description)
  values (p_user_id, p_action, -p_amount, v_balance, p_project_id, p_description);

  return v_balance;
end;
$$ language plpgsql security definer;

-- =============================================
-- 9. Add credits (for subscriptions/topups)
-- =============================================
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount int,
  p_action text,
  p_description text default null
) returns int as $$
declare
  v_balance int;
begin
  update public.profiles
  set credits = credits + p_amount, updated_at = now()
  where id = p_user_id
  returning credits into v_balance;

  insert into public.credit_logs (user_id, action, credits, balance, description)
  values (p_user_id, p_action, p_amount, v_balance, p_description);

  return v_balance;
end;
$$ language plpgsql security definer;
