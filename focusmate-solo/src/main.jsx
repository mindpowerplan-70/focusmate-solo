// src/main.jsx
// Entry point with routing and auth protection

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import Dashboard from "./Dashboard.jsx";
import "./index.css";

// This wrapper checks if user is logged in before showing dashboard
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Still checking auth status
  if (user === undefined) return null;

  // Not logged in — send to auth page
  if (!user) return <Navigate to="/auth" />;

  // Logged in — show the dashboard
  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
