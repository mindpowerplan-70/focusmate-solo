import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ============================================
// TIME TRACKER COMPONENT
// A live stopwatch that saves billable hours
// to Supabase when the user stops it
// ============================================

export default function TimeTracker({ user, onEntrySaved }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState(75);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  // ---- TIMER LOGIC ----
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ---- FORMAT SECONDS → HH:MM:SS ----
  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  // ---- CALCULATE INCOME EARNED SO FAR ----
  const incomeEarned = ((seconds / 3600) * hourlyRate).toFixed(2);

  // ---- SAVE ENTRY TO SUPABASE ----
  const handleStop = async () => {
    setIsRunning(false);
    if (seconds < 60) {
      setMessage("⚠️ Minimum 1 minute to save an entry.");
      return;
    }
    if (!description.trim()) {
      setMessage("⚠️ Please add a description before saving.");
      return;
    }

    setSaving(true);
    const durationMinutes = Math.round(seconds / 60);

    const { error } = await supabase.from("time_entries").insert({
      user_id: user.id,
      description: description.trim(),
      duration_minutes: durationMinutes,
      hourly_rate: hourlyRate,
      is_forgotten: false,
    });

    setSaving(false);

    if (error) {
      setMessage("❌ Error saving entry. Try again.");
    } else {
      setMessage(`✅ Saved! You just logged ${durationMinutes} minutes.`);
      setSeconds(0);
      setDescription("");
      if (onEntrySaved) onEntrySaved(); // tells Dashboard to refresh
    }
  };

  return (
    <div
      style={{
        background: "#1e1b2e",
        border: "1px solid #a78bfa",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h2 style={{ color: "#a78bfa", marginBottom: "16px" }}>
        ⏱ Live Time Tracker
      </h2>

      {/* DESCRIPTION INPUT */}
      <input
        type="text"
        placeholder="What are you working on?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isRunning}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #4c1d95",
          background: "#0f0a1e",
          color: "#fff",
          marginBottom: "12px",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {/* HOURLY RATE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <label style={{ color: "#a0aec0" }}>£/hr:</label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          disabled={isRunning}
          style={{
            width: "80px",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #4c1d95",
            background: "#0f0a1e",
            color: "#fff",
            fontSize: "15px",
          }}
        />
      </div>

      {/* TIMER DISPLAY */}
      <div
        style={{
          fontSize: "52px",
          fontWeight: "bold",
          color: isRunning ? "#a78bfa" : "#4a5568",
          textAlign: "center",
          margin: "16px 0",
          fontFamily: "monospace",
        }}
      >
        {formatTime(seconds)}
      </div>

      {/* INCOME EARNED */}
      {isRunning && (
        <div
          style={{
            textAlign: "center",
            color: "#68d391",
            fontSize: "18px",
            marginBottom: "16px",
          }}
        >
          💰 £{incomeEarned} earned so far
        </div>
      )}

      {/* START / STOP BUTTONS */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        {!isRunning ? (
          <button
            onClick={() => {
              setIsRunning(true);
              setMessage("");
            }}
            disabled={!description.trim()}
            style={{
              background: description.trim() ? "#a78bfa" : "#4a5568",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "16px",
              cursor: description.trim() ? "pointer" : "not-allowed",
            }}
          >
            ▶ Start Timer
          </button>
        ) : (
          <button
            onClick={handleStop}
            disabled={saving}
            style={{
              background: "#e53e3e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "⏹ Stop & Save"}
          </button>
        )}
      </div>

      {/* STATUS MESSAGE */}
      {message && (
        <p style={{ textAlign: "center", marginTop: "12px", color: "#a78bfa" }}>
          {message}
        </p>
      )}
    </div>
  );
}
