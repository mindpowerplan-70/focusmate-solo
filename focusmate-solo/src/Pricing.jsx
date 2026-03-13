import { useState } from "react";
import { supabase } from "./supabase";

// ============================================
// PRICING PAGE
// Shows the £79/month plan and triggers
// Stripe checkout when user clicks subscribe
// ============================================

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    try {
      // Call our serverless function to create checkout session
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a1e",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "32px" }}>⚡</span>
          <h1 style={{ color: "#a78bfa", margin: "8px 0 4px" }}>
            FocusMate Solo
          </h1>
          <p style={{ color: "#a0aec0", fontSize: "16px" }}>
            Recover the income you're already earning but not capturing
          </p>
        </div>

        {/* PRICING CARD */}
        <div
          style={{
            background: "#1a1a2e",
            border: "2px solid #a78bfa",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
          }}
        >
          {/* PRICE */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ color: "#a0aec0", fontSize: "14px" }}>
              Monthly subscription
            </span>
            <div style={{ margin: "8px 0" }}>
              <span
                style={{
                  color: "#fff",
                  fontSize: "52px",
                  fontWeight: "bold",
                }}
              >
                £79
              </span>
              <span style={{ color: "#a0aec0", fontSize: "16px" }}>/month</span>
            </div>
            <p style={{ color: "#68d391", fontSize: "14px", margin: 0 }}>
              Average user recovers £400+/month
            </p>
          </div>

          {/* FEATURES */}
          {[
            "⏱ Live time tracker with £ counter",
            "💜 Forgiveness Mode — log forgotten hours",
            "🤖 AI task breakdown for ADHD paralysis",
            "📊 Weekly income recovery report",
            "🏆 All-time recovery tracking",
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
                color: "#e2e8f0",
                fontSize: "15px",
              }}
            >
              {feature}
            </div>
          ))}

          {/* CTA BUTTON */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#4a5568" : "#a78bfa",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "24px",
            }}
          >
            {loading ? "Setting up checkout..." : "Start Subscription →"}
          </button>

          {error && (
            <p
              style={{
                color: "#fc8181",
                textAlign: "center",
                marginTop: "12px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <p
            style={{
              color: "#a0aec0",
              textAlign: "center",
              fontSize: "12px",
              marginTop: "16px",
            }}
          >
            Secured by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
