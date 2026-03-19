"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { PLAN_CONFIG } from "@/lib/supabase/types";

export default function UserMenu() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!profile) return null;

  const planConfig = PLAN_CONFIG[profile.plan as keyof typeof PLAN_CONFIG];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-sm font-bold">
            {(profile.name || profile.email)[0].toUpperCase()}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm text-white font-medium leading-none">{profile.name || profile.email.split("@")[0]}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{profile.credits} credits</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 py-2">
          {/* Plan info */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-xs text-zinc-500">Plan</p>
            <p className="text-sm text-white font-medium">{planConfig.name} — ${planConfig.price}/mo</p>
          </div>

          {/* Credits */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-xs text-zinc-500">Credits</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">{profile.credits}</span>
              <span className="text-xs text-zinc-500">/ {planConfig.monthlyCredits} monthly</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${Math.min(100, (profile.credits / planConfig.monthlyCredits) * 100)}%` }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="px-4 py-2">
            <p className="text-xs text-zinc-500 truncate">{profile.email}</p>
          </div>

          {/* Logout */}
          <div className="px-2 pt-1 border-t border-zinc-800 mt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
