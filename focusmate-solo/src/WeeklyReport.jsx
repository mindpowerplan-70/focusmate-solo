// WeeklyReport.jsx
// Shows the user a weekly summary of hours tracked and income recovered
// Queries time_entries for the current week and joins with profile hourly rate

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function WeeklyReport() {
  const [entries, setEntries] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(50); // fallback default
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    setLoading(true);

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile to get hourly rate and name
    const { data: profile } = await supabase
      .from("profiles")
      .select("hourly_rate, full_name")
      .eq("id", user.id)
      .single();

    if (profile) {
      setHourlyRate(profile.hourly_rate || 50);
      setUserName(profile.full_name || "");
    }

    // Calculate start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday...
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    // Fetch all time entries from Monday onwards
    const { data: timeEntries } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", monday.toISOString())
      .order("created_at", { ascending: false });

    setEntries(timeEntries || []);
    setLoading(false);
  }

  // Total minutes tracked this week
  const totalMinutes = entries.reduce((sum, entry) => {
    return sum + (entry.duration_minutes || 0);
  }, 0);

  const totalHours = totalMinutes / 60;

  // Income uses EACH ENTRY'S OWN hourly rate — not the profile default
  // This supports multiple clients at different rates
  const incomeRecovered = entries.reduce((sum, entry) => {
    const hours = (entry.duration_minutes || 0) / 60;
    const rate = entry.hourly_rate || hourlyRate; // fallback to profile rate if missing
    return sum + hours * rate;
  }, 0);

  // How many different days had at least one entry
  const activeDays = new Set(
    entries.map((e) => new Date(e.created_at).toDateString()),
  ).size;

  // Days remaining this week (Mon=1 through Fri=5)
  const today = new Date();
  const dayNum = today.getDay() === 0 ? 7 : today.getDay();
  const daysLeft = Math.max(0, 5 - dayNum); // business days left

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
        Loading your weekly report...
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1a1a2e" }}>
          📊 Your Week in Numbers
        </h2>
        <p style={{ color: "#666", marginTop: "0.3rem" }}>
          {userName ? `Nice work, ${userName.split(" ")[0]}.` : "Nice work."}{" "}
          Here's what you've recovered so far this week.
        </p>
      </div>

      {/* Big income number — the hero stat */}
      <div
        style={{
          background: "linear-gradient(135deg, #6c63ff, #4ecdc4)",
          borderRadius: "16px",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        <p
          style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "0.5rem" }}
        >
          💰 Income Recovered This Week
        </p>
        <p style={{ fontSize: "3rem", fontWeight: "800", margin: 0 }}>
          £{incomeRecovered.toFixed(2)}
        </p>
        <p style={{ fontSize: "0.85rem", opacity: 0.75, marginTop: "0.5rem" }}>
          Across {entries.length} session{entries.length !== 1 ? "s" : ""} this
          week
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard
          icon="⏱"
          label="Hours Tracked"
          value={totalHours.toFixed(1) + "h"}
        />
        <StatCard icon="📅" label="Active Days" value={activeDays + " / 5"} />
        <StatCard icon="📋" label="Sessions Logged" value={entries.length} />
      </div>

      {/* Motivational message */}
      <div
        style={{
          background: "#f0f4ff",
          borderRadius: "12px",
          padding: "1.2rem 1.5rem",
          marginBottom: "1.5rem",
          borderLeft: "4px solid #6c63ff",
        }}
      >
        <p style={{ margin: 0, color: "#333", fontSize: "0.95rem" }}>
          {getMotivationalMessage(incomeRecovered, daysLeft, activeDays)}
        </p>
      </div>

      {/* Recent entries list */}
      {entries.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#444",
              marginBottom: "0.8rem",
            }}
          >
            This Week's Sessions
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {entries.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "#fafafa",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              >
                <div>
                  <p
                    style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}
                  >
                    {entry.task_name || "Untitled session"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>
                    {new Date(entry.created_at).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#a78bfa" }}>
                    £
                    {(
                      (entry.duration_minutes / 60) *
                      (entry.hourly_rate || hourlyRate)
                    ).toFixed(2)}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>
                    {entry.duration_minutes} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div style={{ textAlign: "center", color: "#999", padding: "2rem" }}>
          <p>No time entries yet this week.</p>
          <p style={{ fontSize: "0.85rem" }}>
            Head to the Time Tracker tab to log your first session!
          </p>
        </div>
      )}
    </div>
  );
}

// Small reusable stat card component
function StatCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "1.5rem", margin: "0 0 0.3rem" }}>{icon}</p>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "700",
          margin: 0,
          color: "#1a1a2e",
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: "0.75rem", color: "#888", margin: "0.2rem 0 0" }}>
        {label}
      </p>
    </div>
  );
}

// Generates a different message based on how the week is going
function getMotivationalMessage(income, daysLeft, activeDays) {
  if (income === 0) {
    return "🌱 Your week is just getting started. Log your first session to see your income tracker kick in.";
  }
  if (income < 100 && daysLeft > 2) {
    return `🚀 Good start! You've got ${daysLeft} working days left — keep logging and watch this number grow.`;
  }
  if (income >= 100 && income < 300) {
    return `💪 You're building momentum. Every session you log is income you won't lose. Keep it up.`;
  }
  if (income >= 300 && income < 500) {
    return `🔥 Solid week! You've recovered £${income.toFixed(0)} so far. FocusMate is already paying for itself.`;
  }
  if (income >= 500) {
    return `🏆 Exceptional week. £${income.toFixed(0)} recovered and ${activeDays} active days. This is exactly what financial clarity looks like.`;
  }
  return `📈 Keep logging — every minute counts toward your weekly total.`;
}
