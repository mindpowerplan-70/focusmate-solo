// WeeklyReport.jsx
// Shows the user a weekly summary of hours tracked and income recovered
// Queries time_entries for the current week and joins with profile hourly rate

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function WeeklyReport() {
  const [entries, setEntries] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

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
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const { data: timeEntries } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", monday.toISOString())
      .order("created_at", { ascending: false });

    setEntries(timeEntries || []);
    setLoading(false);
  }

  const totalMinutes = entries.reduce(
    (sum, e) => sum + (e.duration_minutes || 0),
    0,
  );
  const totalHours = totalMinutes / 60;

  const incomeRecovered = entries.reduce((sum, e) => {
    const hours = (e.duration_minutes || 0) / 60;
    const rate = e.hourly_rate || hourlyRate;
    return sum + hours * rate;
  }, 0);

  const activeDays = new Set(
    entries.map((e) => new Date(e.created_at).toDateString()),
  ).size;

  const today = new Date();
  const dayNum = today.getDay() === 0 ? 7 : today.getDay();
  const daysLeft = Math.max(0, 5 - dayNum);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#a78bfa" }}>
        Loading your weekly report...
      </div>
    );
  }

  return (
    <div style={{ padding: "0.5rem 0", maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            color: "#a78bfa",
            margin: 0,
          }}
        >
          📊 Your Week in Numbers
        </h2>
        <p
          style={{ color: "#a0aec0", marginTop: "0.4rem", fontSize: "0.95rem" }}
        >
          {userName ? `Nice work, ${userName.split(" ")[0]}.` : "Nice work."}{" "}
          Here's what you've recovered so far this week.
        </p>
      </div>

      {/* Empty state — no entries this week */}
      {entries.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "rgba(167,139,250,0.08)",
            borderRadius: "16px",
            border: "1px dashed #a78bfa",
            color: "#c4b5fd",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1rem" }}>
            No sessions logged this week yet
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", opacity: 0.8 }}>
            Head to the Time Tracker tab and log your first session — it'll show
            up here instantly!
          </p>
        </div>
      ) : (
        <>
          {/* Big income hero stat */}
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
              style={{
                fontSize: "0.9rem",
                opacity: 0.85,
                marginBottom: "0.5rem",
              }}
            >
              💰 Income Recovered This Week
            </p>
            <p style={{ fontSize: "3rem", fontWeight: "800", margin: 0 }}>
              £{incomeRecovered.toFixed(2)}
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                opacity: 0.75,
                marginTop: "0.5rem",
              }}
            >
              Across {entries.length} session{entries.length !== 1 ? "s" : ""}{" "}
              this week
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
            <StatCard
              icon="📅"
              label="Active Days"
              value={activeDays + " / 5"}
            />
            <StatCard
              icon="📋"
              label="Sessions Logged"
              value={entries.length}
            />
          </div>

          {/* Motivational message */}
          <div
            style={{
              background: "rgba(167,139,250,0.1)",
              borderRadius: "12px",
              padding: "1.2rem 1.5rem",
              marginBottom: "1.5rem",
              borderLeft: "4px solid #a78bfa",
            }}
          >
            <p style={{ margin: 0, color: "#e2e8f0", fontSize: "0.95rem" }}>
              {getMotivationalMessage(incomeRecovered, daysLeft, activeDays)}
            </p>
          </div>

          {/* Sessions list */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#a78bfa",
                marginBottom: "0.8rem",
              }}
            >
              This Week's Sessions
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    background: "#1a1a2e",
                    borderRadius: "8px",
                    border: "1px solid #2d1b69",
                  }}
                >
                  <div>
                    {/* Fixed: uses entry.description not entry.task_name */}
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        color: "#fff",
                      }}
                    >
                      {entry.is_forgotten ? "💜 " : "⏱ "}
                      {entry.description || "Untitled session"}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#a0aec0",
                      }}
                    >
                      {new Date(entry.created_at).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{ margin: 0, fontWeight: "600", color: "#68d391" }}
                    >
                      £
                      {(
                        (entry.duration_minutes / 60) *
                        (entry.hourly_rate || hourlyRate)
                      ).toFixed(2)}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#a0aec0",
                      }}
                    >
                      {entry.duration_minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Stat card — dark theme version
function StatCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: "rgba(167,139,250,0.1)",
        border: "1px solid rgba(167,139,250,0.2)",
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
          color: "#fff",
        }}
      >
        {value}
      </p>
      <p
        style={{ fontSize: "0.75rem", color: "#a78bfa", margin: "0.2rem 0 0" }}
      >
        {label}
      </p>
    </div>
  );
}

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
