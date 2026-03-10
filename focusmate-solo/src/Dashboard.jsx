// src/Dashboard.jsx
// The main app screen users see after logging in
// Contains: welcome message, quick stats, and the task input box
// (AI breakdown feature comes Day 5 — today we build the shell)

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  // Get the current logged-in user when the page loads
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  // Log the user out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p style={styles.loadingText}>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ---- SIDEBAR ---- */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarLogo}>FocusMate Solo</h2>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}>🧠 Task Breakdown</div>
          <div style={styles.navItem}>⏱ Time Tracker</div>
          <div style={styles.navItem}>📊 Weekly Report</div>
          <div style={styles.navItem}>⚙️ Settings</div>
        </nav>
        <button onClick={handleSignOut} style={styles.signOutBtn}>
          Sign Out
        </button>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Good to see you 👋</h1>
            <p style={styles.subGreeting}>
              {user?.email} — What are we working on today?
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: "Hours tracked today", value: "0.0h", color: "#a78bfa" },
            { label: "Income recovered today", value: "£0", color: "#34d399" },
            { label: "Tasks broken down", value: "0", color: "#60a5fa" },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>
                {stat.value}
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ---- TASK BREAKDOWN INPUT ---- */}
        {/* This is the core feature — AI breakdown comes Day 5 */}
        <div style={styles.taskCard}>
          <h2 style={styles.taskTitle}>
            🧠 What are you most avoiding right now?
          </h2>
          <p style={styles.taskSubtitle}>
            Type any task — no matter how scary — and we'll break it into steps
            your brain can actually start.
          </p>
          <textarea
            placeholder="e.g. Write the proposal for the Johnson account..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={styles.taskInput}
            rows={3}
          />
          <button
            style={styles.breakdownBtn}
            onClick={() => alert("AI breakdown coming tomorrow! 🚀")}
          >
            ✨ Break it down for me
          </button>
          <p style={styles.taskHint}>
            The AI will split this into 8 specific steps, starting with the
            easiest one. The wall of awful disappears.
          </p>
        </div>

        {/* ---- FORGIVENESS MODE ---- */}
        <div style={styles.forgivenessCard}>
          <h3 style={styles.forgivenessTitle}>⏱ Add time I forgot to track</h3>
          <p style={styles.forgivenessText}>
            Had a productive session but forgot to start the timer? No shame.
            Just add it here.
          </p>
          <div style={styles.forgivenessRow}>
            <input
              type="text"
              placeholder="What did you work on?"
              style={styles.forgivenessInput}
            />
            <input
              type="number"
              placeholder="Hours"
              style={{ ...styles.forgivenessInput, width: "80px" }}
            />
            <button style={styles.forgivenessBtn}>Add Time</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  loadingPage: {
    backgroundColor: "#0f0f13",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: "1rem",
  },
  page: {
    display: "flex",
    backgroundColor: "#0f0f13",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#f0f0f0",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#13131a",
    borderRight: "1px solid #2a2a3a",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    position: "fixed",
    height: "100vh",
  },
  sidebarLogo: {
    color: "#a78bfa",
    fontSize: "1.1rem",
    fontWeight: "800",
    margin: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1,
  },
  navItemActive: {
    padding: "0.75rem 1rem",
    backgroundColor: "#1e1b2e",
    borderRadius: "8px",
    color: "#a78bfa",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid #a78bfa33",
  },
  navItem: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    color: "#666",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  signOutBtn: {
    padding: "0.6rem",
    backgroundColor: "transparent",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#555",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  main: {
    marginLeft: "260px",
    flex: 1,
    padding: "2.5rem",
    maxWidth: "900px",
    width: "100%",
  },
  header: {
    marginBottom: "2rem",
    paddingTop: "1rem",
  },
  greeting: {
    fontSize: "1.8rem",
    fontWeight: "700",
    margin: "0 0 0.25rem",
    color: "#fff",
  },
  subGreeting: {
    color: "#666",
    fontSize: "0.9rem",
    margin: 0,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "12px",
    padding: "1.25rem",
  },
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "0.25rem",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#666",
  },
  taskCard: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  taskTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    margin: "0 0 0.5rem",
    color: "#fff",
  },
  taskSubtitle: {
    color: "#888",
    fontSize: "0.9rem",
    marginBottom: "1rem",
    lineHeight: 1.6,
  },
  taskInput: {
    width: "100%",
    backgroundColor: "#0f0f13",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    padding: "0.85rem 1rem",
    outline: "none",
    resize: "vertical",
    marginBottom: "1rem",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  breakdownBtn: {
    padding: "0.9rem 2rem",
    backgroundColor: "#a78bfa",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "0.75rem",
  },
  taskHint: {
    color: "#555",
    fontSize: "0.8rem",
    margin: 0,
    lineHeight: 1.6,
  },
  forgivenessCard: {
    backgroundColor: "#1a1a24",
    border: "1px solid #2a2a3a",
    borderRadius: "12px",
    padding: "1.5rem",
  },
  forgivenessTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 0 0.5rem",
    color: "#fff",
  },
  forgivenessText: {
    color: "#888",
    fontSize: "0.85rem",
    marginBottom: "1rem",
    lineHeight: 1.6,
  },
  forgivenessRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  forgivenessInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    backgroundColor: "#0f0f13",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    minWidth: "150px",
  },
  forgivenessBtn: {
    padding: "0.75rem 1.25rem",
    backgroundColor: "#1e1b2e",
    color: "#a78bfa",
    border: "1px solid #a78bfa44",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
};
