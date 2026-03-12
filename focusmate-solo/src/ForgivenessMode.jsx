import { useState } from "react";
import { supabase } from "./supabase";

// ============================================
// FORGIVENESS MODE COMPONENT
// The hero feature — log hours you forgot
// to track without shame or judgement.
// Every entry shows the £ value recovered.
// ============================================

export default function ForgivenessMode({ user, onEntrySaved }) {
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ---- CALCULATE RECOVERY VALUE ----
  const totalMinutes = hours * 60 + Number(minutes);
  const recoveredIncome = ((totalMinutes / 60) * hourlyRate).toFixed(2);

  // ---- SAVE FORGOTTEN ENTRY TO SUPABASE ----
  const handleSave = async () => {
    if (!description.trim()) {
      setMessage("⚠️ Please describe what you worked on.");
      return;
    }
    if (totalMinutes < 15) {
      setMessage("⚠️ Minimum 15 minutes to log forgotten time.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("time_entries").insert({
      user_id: user.id,
      description: description.trim(),
      duration_minutes: totalMinutes,
      hourly_rate: hourlyRate,
      is_forgotten: true, // 👈 This is what marks it as Forgiveness Mode
    });

    setSaving(false);

    if (error) {
      setMessage("❌ Error saving. Please try again.");
    } else {
      setMessage(`✅ Recovered! You just reclaimed £${recoveredIncome} 💜`);
      setDescription("");
      setHours(1);
      setMinutes(0);
      if (onEntrySaved) onEntrySaved(); // tells Dashboard to refresh stats
    }
  };

  return (
    <div
      style={{
        background: "#1a1a2e",
        border: "2px solid #6d28d9",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      {/* HEADER */}
      <h2 style={{ color: "#a78bfa", marginBottom: "4px" }}>
        💜 Forgiveness Mode
      </h2>
      <p style={{ color: "#a0aec0", fontSize: "14px", marginBottom: "20px" }}>
        Did time pass without tracking? No guilt. Just log it now and reclaim
        what you earned.
      </p>

      {/* DESCRIPTION */}
      <input
        type="text"
        placeholder="What did you work on? (e.g. 'Client strategy call')"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #4c1d95",
          background: "#0f0a1e",
          color: "#fff",
          marginBottom: "16px",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {/* TIME INPUTS */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* HOURS */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              color: "#a0aec0",
              fontSize: "13px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Hours
          </label>
          <input
            type="number"
            min="0"
            max="12"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #4c1d95",
              background: "#0f0a1e",
              color: "#fff",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* MINUTES */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              color: "#a0aec0",
              fontSize: "13px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Minutes
          </label>
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #4c1d95",
              background: "#0f0a1e",
              color: "#fff",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          >
            <option value={0}>00</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
          </select>
        </div>

        {/* HOURLY RATE */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              color: "#a0aec0",
              fontSize: "13px",
              display: "block",
              marginBottom: "6px",
            }}
          >
            £/hr rate
          </label>
          <input
            type="number"
            min="0"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #4c1d95",
              background: "#0f0a1e",
              color: "#fff",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* RECOVERY PREVIEW */}
      {totalMinutes >= 15 && (
        <div
          style={{
            background: "#2d1b69",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#a0aec0", fontSize: "13px", margin: "0 0 4px 0" }}
          >
            You're about to recover
          </p>
          <p
            style={{
              color: "#68d391",
              fontSize: "28px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            £{recoveredIncome}
          </p>
          <p
            style={{ color: "#a0aec0", fontSize: "13px", margin: "4px 0 0 0" }}
          >
            {hours}h {minutes}m @ £{hourlyRate}/hr
          </p>
        </div>
      )}

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          background: saving ? "#4a5568" : "#6d28d9",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "14px",
          fontSize: "16px",
          cursor: saving ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {saving ? "Saving..." : "💜 Log Forgotten Time"}
      </button>

      {/* STATUS MESSAGE */}
      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "12px",
            color: message.includes("✅") ? "#68d391" : "#fc8181",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
