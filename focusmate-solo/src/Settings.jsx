// Settings.jsx
// Lets users update their display name and hourly rate
// Reads from and writes to the 'profiles' table in Supabase

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function Settings({ onSaved }) {
  const [hourlyRate, setHourlyRate] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing profile data on mount
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("hourly_rate, full_name")
        .eq("id", user.id)
        .single();

      if (data) {
        setHourlyRate(data.hourly_rate ?? "");
        setDisplayName(data.full_name ?? "");
      }
    }
    loadProfile();
  }, []);

  // Save updated profile to Supabase
  async function handleSave() {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        hourly_rate: parseFloat(hourlyRate) || 0,
        full_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.log("Save error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } else {
      setMessage("✅ Settings saved!");
      // Tell Dashboard the rate changed so TimeTracker updates immediately
      if (onSaved) onSaved();
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

      {/* Display Name */}
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

      {/* Hourly Rate */}
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

      {message && (
        <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}>
          {message}
        </p>
      )}
    </div>
  );
}
