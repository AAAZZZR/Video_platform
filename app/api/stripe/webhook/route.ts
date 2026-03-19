import { NextResponse } from "next/server";
import { stripe, getPlanByPriceId, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan as "t1" | "t2" | undefined;

        if (!userId || !plan || !PLANS[plan]) break;

        // Update user plan, credits, and subscription ID
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await supabase
          .from("profiles")
          .update({
            plan,
            credits: PLANS[plan].credits,
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        // Log the transaction
        await supabase.from("transactions").insert({
          user_id: userId,
          type: "subscription",
          amount: (session.amount_total || 0) / 100,
          credits: PLANS[plan].credits,
          stripe_payment_id: session.payment_intent as string,
        });

        // Log credit change
        await supabase.from("credit_logs").insert({
          user_id: userId,
          action: "subscription_reset",
          credits: PLANS[plan].credits,
          balance: PLANS[plan].credits,
          description: `Subscribed to ${PLANS[plan].name} plan`,
        });

        break;
      }

      case "invoice.paid": {
        // Monthly renewal — reset credits
        const invoice = event.data.object;
        if (invoice.billing_reason !== "subscription_cycle") break;

        const subscriptionId = (invoice as any).subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) break;

        const plan = getPlanByPriceId(priceId);
        if (!plan) break;

        // Find user by subscription ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (!profile) break;

        // Reset credits for the new billing cycle
        await supabase
          .from("profiles")
          .update({
            credits: PLANS[plan].credits,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        await supabase.from("credit_logs").insert({
          user_id: profile.id,
          action: "subscription_reset",
          credits: PLANS[plan].credits,
          balance: PLANS[plan].credits,
          description: `Monthly renewal — ${PLANS[plan].name} plan`,
        });

        break;
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled — downgrade to free
        const subscription = event.data.object;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (!profile) break;

        await supabase
          .from("profiles")
          .update({
            plan: "free",
            credits: 30,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        await supabase.from("credit_logs").insert({
          user_id: profile.id,
          action: "subscription_cancelled",
          credits: 30,
          balance: 30,
          description: "Subscription cancelled — downgraded to Free",
        });

        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
