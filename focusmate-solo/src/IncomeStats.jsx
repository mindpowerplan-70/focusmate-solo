// src/IncomeStats.jsx
// Shows income summary stats pulled from Supabase time_entries
// Displays empty state if no entries exist yet

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function IncomeStats({ user, hourlyRate }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setEntries(data || []);
      setLoading(false);
    };

    fetchEntries();
  }, [user]);

  // Calculate totals
  const totalMinutes = entries.reduce(
    (sum, e) => sum + (e.duration_minutes || 0),
    0,
  );
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalIncome = entries.reduce((sum, e) => {
    const rate = e.hourly_rate || hourlyRate || 0;
    return sum + (e.duration_minutes / 60) * rate;
  }, 0);

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#a78bfa" }}>
        Loading your stats...
      </div>
    );
  }

  // Empty state — no entries yet
  if (entries.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "rgba(167,139,250,0.08)",
          borderRadius: "12px",
          border: "1px dashed #a78bfa",
          color: "#c4b5fd",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💸</div>
        <p style={{ margin: 0, fontWeight: 600 }}>No income tracked yet</p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", opacity: 0.8 }}>
          Start your first session and watch the money add up!
        </p>
      </div>
    );
  }

  // Normal state — show stats
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <div style={statCard}>
        <span style={statLabel}>Total Hours</span>
        <span style={statValue}>{totalHours}h</span>
      </div>
      <div style={statCard}>
        <span style={statLabel}>Income Recovered</span>
        <span style={statValue}>£{totalIncome.toFixed(2)}</span>
      </div>
      <div style={statCard}>
        <span style={statLabel}>Sessions Logged</span>
        <span style={statValue}>{entries.length}</span>
      </div>
    </div>
  );
}

// Styles
const statCard = {
  flex: 1,
  minWidth: "120px",
  background: "rgba(167,139,250,0.1)",
  borderRadius: "12px",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  border: "1px solid rgba(167,139,250,0.2)",
};

const statLabel = {
  fontSize: "0.8rem",
  color: "#a78bfa",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const statValue = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#fff",
};
