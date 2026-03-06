// src/App.jsx
// This is your complete landing page for FocusMate Solo
// It includes: hero section, pain points, features, pricing, and email capture

import { useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  // This tracks what the user types in the email box
  const [email, setEmail] = useState("");
  // This shows a thank you message after they sign up
  const [submitted, setSubmitted] = useState(false);

  // This runs when they click the sign up button
  const handleSubmit = async () => {
    if (!email) return;

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving email:", error);
      setSubmitted(true);
    }
  };

  return (
    <div style={styles.page}>
      {/* ---- NAVIGATION ---- */}
      <nav style={styles.nav}>
        <span style={styles.logo}>FocusMate Solo</span>
        <a href="#pricing" style={styles.navLink}>
          Pricing
        </a>
      </nav>

      {/* ---- HERO SECTION ---- */}
      {/* This is the first thing visitors see - make it count */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>Built for ADHD brains 🧠</div>
        <h1 style={styles.heroTitle}>
          You're losing <span style={styles.highlight}>£12,000 a year.</span>
          <br />
          You just haven't counted it yet.
        </h1>
        <p style={styles.heroSubtitle}>
          FocusMate Solo is the AI-powered time tracker that works
          <em> with</em> your ADHD brain — not against it. Recover the income
          you're already earning but not capturing.
        </p>

        {/* Email capture - the most important element on the page */}
        {!submitted ? (
          <div style={styles.captureBox}>
            <input
              type="email"
              placeholder="Enter your email for early access"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSubmit} style={styles.ctaButton}>
              Get Early Access →
            </button>
          </div>
        ) : (
          <div style={styles.thankYou}>
            🎉 You're on the list! We'll be in touch very soon.
          </div>
        )}
        <p style={styles.heroSmall}>
          No credit card. No commitment. Cancel any time.
        </p>
      </section>

      {/* ---- PAIN SECTION ---- */}
      {/* These are the exact words real ADHD freelancers use */}
      <section style={styles.painSection}>
        <h2 style={styles.sectionTitle}>Sound familiar?</h2>
        <div style={styles.painGrid}>
          {[
            {
              quote:
                "I know I worked 6 hours but I can only invoice for 3 because I literally cannot remember what I did.",
              name: "Designer, London",
            },
            {
              quote:
                "I stare at the task for 90 minutes unable to begin. Then I forget to start the timer. Then the day is gone.",
              name: "Developer, Manchester",
            },
            {
              quote:
                "I've tried every time tracking app. They all assume I'll remember to click a button at exactly the right moment.",
              name: "Copywriter, Edinburgh",
            },
          ].map((item, i) => (
            <div key={i} style={styles.painCard}>
              <p style={styles.painQuote}>"{item.quote}"</p>
              <p style={styles.painName}>— {item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How FocusMate Solo works</h2>
        <div style={styles.stepsGrid}>
          {[
            {
              step: "01",
              title: "Tell it what you're avoiding",
              desc: "Type the task that's been sitting on your list. No judgement. Just the task.",
            },
            {
              step: "02",
              title: "AI breaks it into tiny steps",
              desc: "Our AI splits it into 8 specific actions, starting with the easiest one. The wall of awful disappears.",
            },
            {
              step: "03",
              title: "Time tracks itself",
              desc: "As you work through the steps, time is tracked automatically. No buttons to remember.",
            },
            {
              step: "04",
              title: "Forgot to track? No problem",
              desc: "Add time you forgot. No shame message. Just 'Add time I forgot to track.' Because forgetting is normal.",
            },
          ].map((item, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{item.step}</div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- PRICING SECTION ---- */}
      <section style={styles.pricingSection} id="pricing">
        <h2 style={styles.sectionTitle}>Simple pricing</h2>
        <p style={styles.pricingSubtitle}>
          A freelancer billing £65/hour who recovers just 4 hours a week gets
          back <strong>£12,480 a year.</strong> FocusMate Solo costs £79/month.
          You do the maths.
        </p>
        <div style={styles.pricingCard}>
          <div style={styles.pricingBadge}>Most Popular</div>
          <h3 style={styles.pricingName}>Solo Plan</h3>
          <div style={styles.pricingPrice}>
            £79<span style={styles.pricingPer}>/month</span>
          </div>
          <ul style={styles.pricingList}>
            {[
              "✓ Unlimited AI task breakdowns",
              "✓ Automatic time tracking",
              "✓ Forgiveness mode — add forgotten time without shame",
              "✓ Weekly income recovery report",
              "✓ Invoice-ready time exports",
              "✓ Built for ADHD brains, not neurotypical teams",
            ].map((item, i) => (
              <li key={i} style={styles.pricingItem}>
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={styles.pricingCta}
          >
            Start Free Trial →
          </button>
          <p style={styles.pricingSmall}>
            14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer style={styles.footer}>
        <p>FocusMate Solo — Built for ADHD freelancers who bill by the hour.</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.6 }}>
          © 2026 FocusMate Solo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ---- ALL THE STYLING ----
// This controls how everything looks
const styles = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    backgroundColor: "#0f0f13",
    color: "#f0f0f0",
    minHeight: "100vh",
    margin: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.2rem 2rem",
    borderBottom: "1px solid #222",
    position: "sticky",
    top: 0,
    backgroundColor: "#0f0f13",
    zIndex: 100,
  },
  logo: {
    fontWeight: "700",
    fontSize: "1.2rem",
    color: "#a78bfa",
  },
  navLink: {
    color: "#a78bfa",
    textDecoration: "none",
    fontSize: "0.95rem",
  },
  hero: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "5rem 2rem 4rem",
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-block",
    backgroundColor: "#1e1b2e",
    color: "#a78bfa",
    padding: "0.4rem 1rem",
    borderRadius: "999px",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
    border: "1px solid #a78bfa44",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "1.5rem",
    color: "#ffffff",
  },
  highlight: {
    color: "#a78bfa",
  },
  heroSubtitle: {
    fontSize: "1.15rem",
    color: "#aaa",
    lineHeight: 1.7,
    marginBottom: "2.5rem",
    maxWidth: "600px",
    margin: "0 auto 2.5rem",
  },
  captureBox: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  input: {
    padding: "0.85rem 1.2rem",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#1a1a24",
    color: "#fff",
    fontSize: "1rem",
    width: "280px",
    outline: "none",
  },
  ctaButton: {
    padding: "0.85rem 1.8rem",
    backgroundColor: "#a78bfa",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  thankYou: {
    backgroundColor: "#1e1b2e",
    border: "1px solid #a78bfa44",
    borderRadius: "8px",
    padding: "1rem 2rem",
    color: "#a78bfa",
    fontSize: "1.1rem",
    marginBottom: "1rem",
  },
  heroSmall: {
    fontSize: "0.8rem",
    color: "#555",
    marginTop: "0.75rem",
  },
  painSection: {
    backgroundColor: "#13131a",
    padding: "4rem 2rem",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    fontWeight: "700",
    marginBottom: "2.5rem",
    color: "#ffffff",
  },
  painGrid: {
    display: "flex",
    gap: "1.5rem",
    maxWidth: "1000px",
    margin: "0 auto",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  painCard: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "12px",
    padding: "1.5rem",
    maxWidth: "300px",
    flex: "1 1 260px",
  },
  painQuote: {
    fontSize: "0.95rem",
    lineHeight: 1.7,
    color: "#ccc",
    fontStyle: "italic",
    marginBottom: "1rem",
  },
  painName: {
    fontSize: "0.8rem",
    color: "#666",
  },
  howSection: {
    padding: "4rem 2rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  stepCard: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  stepNumber: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#a78bfa",
    marginBottom: "0.75rem",
  },
  stepTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#fff",
  },
  stepDesc: {
    fontSize: "0.9rem",
    color: "#999",
    lineHeight: 1.6,
  },
  pricingSection: {
    backgroundColor: "#13131a",
    padding: "4rem 2rem",
    textAlign: "center",
  },
  pricingSubtitle: {
    color: "#aaa",
    maxWidth: "560px",
    margin: "0 auto 2.5rem",
    lineHeight: 1.7,
  },
  pricingCard: {
    backgroundColor: "#1a1a24",
    border: "2px solid #a78bfa",
    borderRadius: "16px",
    padding: "2.5rem",
    maxWidth: "420px",
    margin: "0 auto",
    position: "relative",
  },
  pricingBadge: {
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#a78bfa",
    color: "#fff",
    padding: "0.25rem 1rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  pricingName: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#fff",
  },
  pricingPrice: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#a78bfa",
    marginBottom: "1.5rem",
  },
  pricingPer: {
    fontSize: "1rem",
    color: "#888",
    fontWeight: "400",
  },
  pricingList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 2rem",
    textAlign: "left",
  },
  pricingItem: {
    padding: "0.5rem 0",
    color: "#ccc",
    fontSize: "0.95rem",
    borderBottom: "1px solid #222",
  },
  pricingCta: {
    width: "100%",
    padding: "0.9rem",
    backgroundColor: "#a78bfa",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "0.75rem",
  },
  pricingSmall: {
    fontSize: "0.8rem",
    color: "#555",
  },
  footer: {
    textAlign: "center",
    padding: "2rem",
    color: "#444",
    fontSize: "0.9rem",
    borderTop: "1px solid #1a1a1a",
  },
};
