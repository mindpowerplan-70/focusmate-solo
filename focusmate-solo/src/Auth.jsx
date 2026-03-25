// src/Auth.jsx
// Handles both Login and Signup in one component
// Uses Supabase's built-in auth system

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ---- HANDLE EMAIL CONFIRMATION REDIRECT ----
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setLoading(true);
      setMessage("✅ Email confirmed! Logging you in...");
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          navigate("/dashboard");
        } else {
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: retryData }) => {
              if (retryData?.session) {
                navigate("/dashboard");
              } else {
                setLoading(false);
                setMessage("✅ Email confirmed! Please log in below.");
                setMode("login");
              }
            });
          }, 1500);
        }
      });
    }
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Email confirmation is disabled — redirect straight to dashboard
        if (data?.user) {
          setMessage("✅ Account created! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>FocusMate Solo</h1>
        <p style={styles.tagline}>Recover the income you're already earning.</p>

        <div style={styles.toggle}>
          <button
            onClick={() => setMode("signup")}
            style={
              mode === "signup" ? styles.toggleActive : styles.toggleInactive
            }
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode("login")}
            style={
              mode === "login" ? styles.toggleActive : styles.toggleInactive
            }
          >
            Log In
          </button>
        </div>

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAuth} disabled={loading} style={styles.button}>
          {loading
            ? "Please wait..."
            : mode === "signup"
              ? "Create Account →"
              : "Log In →"}
        </button>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.switchText}>
          {mode === "signup"
            ? "Already have an account? "
            : "Don't have an account? "}
          <span
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            style={styles.switchLink}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#0f0f13",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  logo: {
    color: "#a78bfa",
    fontSize: "1.5rem",
    fontWeight: "800",
    margin: 0,
    textAlign: "center",
  },
  tagline: {
    color: "#666",
    fontSize: "0.9rem",
    textAlign: "center",
    margin: 0,
  },
  toggle: {
    display: "flex",
    backgroundColor: "#0f0f13",
    borderRadius: "8px",
    padding: "4px",
    gap: "4px",
  },
  toggleActive: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#a78bfa",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  toggleInactive: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "transparent",
    color: "#666",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  input: {
    padding: "0.85rem 1rem",
    backgroundColor: "#0f0f13",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "0.9rem",
    backgroundColor: "#a78bfa",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  message: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#aaa",
    margin: 0,
  },
  switchText: {
    textAlign: "center",
    color: "#666",
    fontSize: "0.85rem",
    margin: 0,
  },
  switchLink: {
    color: "#a78bfa",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
