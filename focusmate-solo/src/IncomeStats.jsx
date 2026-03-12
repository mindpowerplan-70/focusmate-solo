import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ============================================
// INCOME RECOVERY STATS COMPONENT
// Shows the user real £ numbers:
// - Total recovered this week
// - Total tracked this week
// - All-time recovery amount
// - Number of forgiveness entries
// This is the number that justifies £79/month
// ============================================

export default function IncomeStats({ user, refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- FETCH STATS FROM SUPABASE ----
  useEffect(() => {
    if (user) fetchStats();
  }, [user, refreshTrigger]); // refreshTrigger re-runs this when new entry saved

  const fetchStats = async () => {
    setLoading(true);

    // Get start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    // Fetch ALL entries for this user
    const { data, error } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id);

    if (error || !data) {
      setLoading(false);
      return;
    }

    // ---- CALCULATE STATS ----
    const weekEntries = data.filter((e) => new Date(e.created_at) >= weekStart);

    // This week — forgotten time (Forgiveness Mode)
    const weekForgotten = weekEntries.filter((e) => e.is_forgotten);
    const weekForgottenIncome = weekForgotten.reduce(
      (sum, e) => sum + (e.duration_minutes / 60) * e.hourly_rate,
      0,
    );

    // This week — tracked time (Live Timer)
    const weekTracked = weekEntries.filter((e) => !e.is_forgotten);
    const weekTrackedIncome = weekTracked.reduce(
      (sum, e) => sum + (e.duration_minutes / 60) * e.hourly_rate,
      0,
    );

    // All time — total recovered via Forgiveness Mode
    const allForgotten = data.filter((e) => e.is_forgotten);
    const allTimeRecovered = allForgotten.reduce(
      (sum, e) => sum + (e.duration_minutes / 60) * e.hourly_rate,
      0,
    );

    // Total hours logged this week
    const weekMinutes = weekEntries.reduce(
      (sum, e) => sum + e.duration_minutes,
      0,
    );

    setStats({
      weekForgottenIncome: weekForgottenIncome.toFixed(2),
      weekTrackedIncome: weekTrackedIncome.toFixed(2),
      weekTotalHours: (weekMinutes / 60).toFixed(1),
      allTimeRecovered: allTimeRecovered.toFixed(2),
      forgivenessCount: allForgotten.length,
    });

    setLoading(false);
  };

  if (loading)
    return (
      <div style={{ color: "#a0aec0", padding: "16px", textAlign: "center" }}>
        Loading your stats...
      </div>
    );

  if (!stats) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ color: "#a78bfa", marginBottom: "16px" }}>
        📊 Your Income Recovery
      </h2>

      {/* STATS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {/* RECOVERED THIS WEEK */}
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #6d28d9",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#a0aec0", fontSize: "13px", margin: "0 0 8px 0" }}
          >
            💜 Recovered This Week
          </p>
          <p
            style={{
              color: "#68d391",
              fontSize: "32px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            £{stats.weekForgottenIncome}
          </p>
          <p
            style={{ color: "#a0aec0", fontSize: "12px", margin: "4px 0 0 0" }}
          >
            via Forgiveness Mode
          </p>
        </div>

        {/* TRACKED THIS WEEK */}
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #a78bfa",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#a0aec0", fontSize: "13px", margin: "0 0 8px 0" }}
          >
            ⏱ Tracked This Week
          </p>
          <p
            style={{
              color: "#a78bfa",
              fontSize: "32px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            £{stats.weekTrackedIncome}
          </p>
          <p
            style={{ color: "#a0aec0", fontSize: "12px", margin: "4px 0 0 0" }}
          >
            {stats.weekTotalHours} hours logged
          </p>
        </div>

        {/* ALL TIME RECOVERED */}
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #68d391",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "#a0aec0", fontSize: "13px", margin: "0 0 8px 0" }}
          >
            🏆 All-Time Recovered
          </p>
          <p
            style={{
              color: "#68d391",
              fontSize: "32px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            £{stats.allTimeRecovered}
          </p>
          <p
            style={{ color: "#a0aec0", fontSize: "12px", margin: "4px 0 0 0" }}
          >
            across {stats.forgivenessCount} forgotten entries
          </p>
        </div>
      </div>
    </div>
  );
}
