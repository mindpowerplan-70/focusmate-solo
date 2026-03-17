// Settings.jsx
// This page lets users view and update their hourly rate and display name
// It reads from and writes to the 'profiles' table in Supabase

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function Settings() {
  // Store the values the user types in
  const [hourlyRate, setHourlyRate] = useState("");
  const [displayName, setDisplayName] = useState("");

  // UI state — are we saving? did it work?
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // When the page loads, fetch the user's existing profile data
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("hourly_rate, full_name")
        .eq("email", user.email)
        .single();

      if (data) {
        setHourlyRate(data.hourly_rate ?? "");
        setDisplayName(data.full_name ?? "");
      }
    }

    loadProfile();
  }, []);

  // Called when the user clicks Save
  async function handleSave() {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Use email to match the row instead of id
    const { error } = await supabase
      .from("profiles")
      .update({
        hourly_rate: parseFloat(hourlyRate) || 0,
        full_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq("email", user.email);

    setSaving(false);

    if (error) {
      console.log("Save error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } else {
      setMessage("✅ Settings saved!");
    }
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "32px",
        background: "#1a1a2e",
        borderRadius: "16px",
        border: "1px solid #2a2a4a",
        fontFamily: "sans-serif",
        color: "#e0e0ff",
      }}
    >
      <h2 style={{ marginBottom: "8px", fontSize: "24px" }}>⚙️ Settings</h2>
      <p style={{ color: "#888", marginBottom: "32px", fontSize: "14px" }}>
        Your hourly rate powers all income calculations in FocusMate Solo.
      </p>

      {/* Display Name Field */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Rich"
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#0f0f1a",
            border: "1px solid #2a2a4a",
            borderRadius: "8px",
            color: "#e0e0ff",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Hourly Rate Field */}
      <div style={{ marginBottom: "32px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#aaa",
          }}
        >
          Hourly Rate (£)
        </label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="e.g. 75"
          min="0"
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#0f0f1a",
            border: "1px solid #2a2a4a",
            borderRadius: "8px",
            color: "#e0e0ff",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />
        <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          This is used to calculate your income recovery stats.
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "14px",
          background: saving ? "#333" : "#6c63ff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {/* Success / Error Message */}
      {message && (
        <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
