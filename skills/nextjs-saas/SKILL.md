---
name: nextjs-saas
description: Complete SaaS boilerplate — Next.js + Supabase Auth + Stripe Subscriptions + Dashboard
metadata:
  tags: saas, nextjs, supabase, stripe, auth, payments, dashboard
---

## When to use

Use this skill when building a SaaS product with Next.js that needs:
- User authentication (Google OAuth + Email/Password)
- Subscription billing (Stripe)
- Credit/usage-based system
- Landing page, dashboard, pricing page

## Architecture Overview

```
Next.js App Router
├── / .................. Landing page (public)
├── /login ............. Auth page (Google OAuth + Email)
├── /pricing ........... Plan comparison (public, auth-gated actions)
├── /dashboard ......... User stats, history, credits
├── /[product] ......... Main product page (auth required)
├── /auth/callback ..... OAuth callback handler
└── /api
    ├── /stripe/checkout .... Create Stripe Checkout Session
    ├── /stripe/portal ...... Create Customer Portal Session
    ├── /stripe/webhook ..... Handle Stripe events (NO auth)
    └── /[product]/... ...... Product API routes (auth + credits)

Infrastructure:
├── Supabase ........... Auth + PostgreSQL + RLS
├── Stripe ............. Subscriptions + Webhooks
├── middleware.ts ...... Session refresh + route protection
└── lib/ ............... Shared utilities
```

## How to use

Read individual rule files for each component:

- [rules/supabase-auth.md](rules/supabase-auth.md) — Auth setup, OAuth, email login, session management
- [rules/supabase-db.md](rules/supabase-db.md) — Database schema, RLS policies, triggers, credit functions
- [rules/stripe-integration.md](rules/stripe-integration.md) — Checkout, webhooks, portal, subscription lifecycle
- [rules/middleware.md](rules/middleware.md) — Route protection, public pages, API exemptions
- [rules/credit-system.md](rules/credit-system.md) — Credit deduction, balance checks, audit logging
- [rules/pages.md](rules/pages.md) — Landing page, login, pricing, dashboard patterns
