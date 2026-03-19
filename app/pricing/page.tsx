"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { PLAN_CONFIG } from "@/lib/supabase/types";

const FEATURES = {
  free: [
    "30 credits / month",
    "720p resolution",
    "Watermark on videos",
    "3 generations per day",
    "Template mode",
  ],
  t1: [
    "200 credits / month",
    "1080p resolution",
    "No watermark",
    "50 generations per day",
    "Template + Quick mode",
    "Edge TTS voices",
  ],
  t2: [
    "1,000 credits / month",
    "1080p resolution",
    "No watermark",
    "Unlimited generations",
    "All modes including Creative",
    "Priority rendering",
    "All TTS voices",
  ],
};

export default function PricingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, [supabase]);

  const handleSubscribe = async (plan: "t1" | "t2") => {
    // Check if user is logged in first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleManage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error || "Failed to open portal");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = profile?.plan || "free";

  // Each plan card
  const plans = [
    { key: "free" as const, name: "Free", price: 0, popular: false },
    { key: "t1" as const, name: "T1", price: 5, popular: true },
    { key: "t2" as const, name: "T2", price: 20, popular: false },
  ];

  return (
    // Full page with header link back to home
    <div className="min-h-screen bg-[#09090b]">
      {/* Simple header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">VidCraft AI</span>
          </a>
          <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">← Back</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h1>
          <p className="text-zinc-400">Unlock more credits and premium features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(({ key, name, price, popular }) => {
            const isCurrentPlan = currentPlan === key;
            const features = FEATURES[key];
            const isUpgrade = key !== "free" && currentPlan === "free";
            const isDowngrade = key === "free" && currentPlan !== "free";

            return (
              <div
                key={key}
                className={`relative border rounded-2xl p-6 flex flex-col ${
                  popular
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {/* Popular badge */}
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-lg font-bold text-white mb-1">{name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${price}</span>
                  <span className="text-zinc-500 text-sm"> / month</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                {isCurrentPlan ? (
                  <div>
                    <button
                      disabled
                      className="w-full py-2.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                    {currentPlan !== "free" && (
                      <button
                        onClick={handleManage}
                        disabled={loading === "manage"}
                        className="w-full mt-2 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {loading === "manage" ? "Loading..." : "Manage Subscription"}
                      </button>
                    )}
                  </div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleSubscribe(key as "t1" | "t2")}
                    disabled={loading === key}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                        : "bg-white hover:bg-zinc-100 text-zinc-900"
                    } disabled:opacity-50`}
                  >
                    {loading === key ? "Loading..." : `Upgrade to ${name}`}
                  </button>
                ) : isDowngrade ? (
                  <button
                    onClick={handleManage}
                    disabled={loading === "manage"}
                    className="w-full py-2.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Manage Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(key as "t1" | "t2")}
                    disabled={loading === key}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-zinc-100 text-zinc-900 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading === key ? "Loading..." : `Switch to ${name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
