// ============================================
// STRIPE CHECKOUT FUNCTION
// Creates a Stripe checkout session and
// returns a URL to redirect the user to pay
// ============================================

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing userId or email" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        supabase_user_id: userId, // 👈 We store this so webhook knows who paid
      },
      success_url: `${req.headers.origin}/dashboard?payment=success`,
      cancel_url: `${req.headers.origin}/pricing?payment=cancelled`,
    });

    // Send back the checkout URL
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ error: error.message });
  }
};
