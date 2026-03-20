import { NextResponse } from "next/server";
import { stripe, getPlanByPriceId, PLANS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Webhook] Missing stripe-signature header");
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
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan as "t1" | "t2" | undefined;

        console.log(`[Webhook] checkout.session.completed — userId=${userId}, plan=${plan}`);

        if (!userId || !plan || !PLANS[plan]) {
          console.error(`[Webhook] Invalid metadata — userId=${userId}, plan=${plan}`);
          break;
        }

        // Get subscription ID
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) {
          console.error("[Webhook] No subscription ID found on session");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Update user plan, credits, and subscription ID
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            plan,
            credits: PLANS[plan].credits,
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updateError) {
          console.error("[Webhook] Failed to update profile:", updateError);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }

        console.log(`[Webhook] Profile updated — user=${userId}, plan=${plan}, credits=${PLANS[plan].credits}`);

        // Log the transaction
        const { error: txError } = await supabase.from("transactions").insert({
          user_id: userId,
          type: "subscription",
          amount: (session.amount_total || 0) / 100,
          credits: PLANS[plan].credits,
          stripe_payment_id: (typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id) || null,
        });

        if (txError) {
          console.error("[Webhook] Failed to insert transaction:", txError);
        }

        // Log credit change
        const { error: creditError } = await supabase.from("credit_logs").insert({
          user_id: userId,
          action: "subscription_reset",
          credits: PLANS[plan].credits,
          balance: PLANS[plan].credits,
          description: `Subscribed to ${PLANS[plan].name} plan`,
        });

        if (creditError) {
          console.error("[Webhook] Failed to insert credit log:", creditError);
        }

        break;
      }

      case "invoice.paid": {
        // Monthly renewal — reset credits
        const invoice = event.data.object;
        if (invoice.billing_reason !== "subscription_cycle") break;

        const subscriptionId = (invoice as any).subscription as string | null;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) break;

        const plan = getPlanByPriceId(priceId);
        if (!plan) break;

        // Find user by subscription ID
        const { data: profile, error: findError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (findError || !profile) {
          console.error("[Webhook] invoice.paid — user not found:", findError);
          break;
        }

        // Reset credits for the new billing cycle
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            credits: PLANS[plan].credits,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (updateError) {
          console.error("[Webhook] Failed to reset credits:", updateError);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }

        console.log(`[Webhook] invoice.paid — credits reset for user=${profile.id}, plan=${plan}`);

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

        const { data: profile, error: findError } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (findError || !profile) {
          console.error("[Webhook] subscription.deleted — user not found:", findError);
          break;
        }

        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            plan: "free",
            credits: 30,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (updateError) {
          console.error("[Webhook] Failed to downgrade user:", updateError);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }

        console.log(`[Webhook] subscription.deleted — user=${profile.id} downgraded to free`);

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
    console.error("[Webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// GET handler for endpoint verification
export async function GET() {
  return NextResponse.json({ status: "Stripe webhook endpoint is active" });
}
