import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import TimeTracker from "./TimeTracker";
import ForgivenessMode from "./ForgivenessMode";
import IncomeStats from "./IncomeStats";

// ============================================
// DASHBOARD — Main app screen after login
// Contains:
// 1. Income Recovery Stats (top)
// 2. Live Time Tracker
// 3. Forgiveness Mode
// 4. AI Task Breakdown
// 5. Recent Entries log
// ============================================

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [task, setTask] = useState("");
  const [breakdown, setBreakdown] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState("tracker"); // tracker | forgiveness | ai

  // ---- GET CURRENT USER ----
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Check if user has active subscription
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", data.user.id)
          .single();
        setIsSubscribed(sub?.status === "active");
      }
      setLoading(false);
    });
  }, []);

  // ---- FETCH RECENT ENTRIES ----
  useEffect(() => {
    if (user) fetchEntries();
  }, [user, refreshTrigger]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setEntries(data);
  };

  // ---- TRIGGERED WHEN ANY ENTRY IS SAVED ----
  // This causes IncomeStats and entries list to refresh
  const handleEntrySaved = () => {
    setRefreshTrigger((n) => n + 1);
  };

  // ---- AI TASK BREAKDOWN ----
  const handleBreakdown = async () => {
    if (!task.trim()) return;
    setAiLoading(true);
    setBreakdown([]);
    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const data = await res.json();
      if (data.steps) setBreakdown(data.steps);
    } catch {
      setBreakdown(["Something went wrong. Please try again."]);
    }
    setAiLoading(false);
  };

  // ---- SIGN OUT ----
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ---- FORMAT DURATION ----
  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // ---- CALCULATE ENTRY VALUE ----
  const entryValue = (entry) =>
    ((entry.duration_minutes / 60) * entry.hourly_rate).toFixed(2);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0a1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#a78bfa",
        }}
      >
        Loading...
      </div>
    );
  // Paywall — redirect to pricing if not subscribed
  if (!loading && !isSubscribed) {
    window.location.href = "/pricing";
    return null;
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a1e",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* ---- TOP NAV ---- */}
      <nav
        style={{
          background: "#1a1a2e",
          borderBottom: "1px solid #2d1b69",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{ color: "#a78bfa", fontWeight: "bold", fontSize: "18px" }}
        >
          ⚡ FocusMate Solo
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#a0aec0", fontSize: "14px" }}>
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid #4a5568",
              color: "#a0aec0",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ---- MAIN CONTENT ---- */}
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* INCOME STATS — always visible at top */}
        {user && <IncomeStats user={user} refreshTrigger={refreshTrigger} />}

        {/* ---- TAB NAVIGATION ---- */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid #2d1b69",
            paddingBottom: "0",
          }}
        >
          {[
            { id: "tracker", label: "⏱ Time Tracker" },
            { id: "forgiveness", label: "💜 Forgiveness Mode" },
            { id: "ai", label: "🤖 AI Breakdown" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #a78bfa"
                    : "2px solid transparent",
                color: activeTab === tab.id ? "#a78bfa" : "#a0aec0",
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- TAB CONTENT ---- */}

        {/* TIME TRACKER TAB */}
        {activeTab === "tracker" && user && (
          <TimeTracker user={user} onEntrySaved={handleEntrySaved} />
        )}

        {/* FORGIVENESS MODE TAB */}
        {activeTab === "forgiveness" && user && (
          <ForgivenessMode user={user} onEntrySaved={handleEntrySaved} />
        )}

        {/* AI BREAKDOWN TAB */}
        {activeTab === "ai" && (
          <div
            style={{
              background: "#1e1b2e",
              border: "1px solid #a78bfa",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h2 style={{ color: "#a78bfa", marginBottom: "8px" }}>
              🤖 AI Task Breakdown
            </h2>
            <p
              style={{
                color: "#a0aec0",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              What are you most avoiding right now? Let's break it down.
            </p>
            <input
              type="text"
              placeholder="e.g. Write the Q4 client report"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBreakdown()}
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
            <button
              onClick={handleBreakdown}
              disabled={aiLoading || !task.trim()}
              style={{
                background: aiLoading ? "#4a5568" : "#a78bfa",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "15px",
                cursor: aiLoading ? "not-allowed" : "pointer",
              }}
            >
              {aiLoading ? "Breaking it down..." : "Break it down →"}
            </button>

            {breakdown.length > 0 && (
              <ol style={{ marginTop: "20px", paddingLeft: "20px" }}>
                {breakdown.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      color: "#e2e8f0",
                      marginBottom: "10px",
                      lineHeight: "1.6",
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* ---- RECENT ENTRIES ---- */}
        {entries.length > 0 && (
          <div>
            <h3 style={{ color: "#a78bfa", marginBottom: "16px" }}>
              📋 Recent Entries
            </h3>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: "#1a1a2e",
                  border: `1px solid ${entry.is_forgotten ? "#6d28d9" : "#2d1b69"}`,
                  borderRadius: "8px",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <span style={{ color: "#fff", fontSize: "14px" }}>
                    {entry.is_forgotten ? "💜 " : "⏱ "}
                    {entry.description}
                  </span>
                  <span
                    style={{
                      color: "#a0aec0",
                      fontSize: "12px",
                      marginLeft: "10px",
                    }}
                  >
                    {formatDuration(entry.duration_minutes)}
                  </span>
                  {entry.is_forgotten && (
                    <span
                      style={{
                        background: "#2d1b69",
                        color: "#a78bfa",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        marginLeft: "8px",
                      }}
                    >
                      recovered
                    </span>
                  )}
                </div>
                <span
                  style={{
                    color: "#68d391",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  £{entryValue(entry)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
