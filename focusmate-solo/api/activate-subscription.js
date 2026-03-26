import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "Missing userId or email" });
  }

  try {
    // Find the Stripe customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      return res.status(404).json({ error: "No Stripe customer found" });
    }

    const customer = customers.data[0];

    // Get their active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    const subscription = subscriptions.data[0];

    // Write to Supabase
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to save subscription" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Activation error:", err);
    return res.status(500).json({ error: err.message });
  }
}
