import { Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import Layout from "@/app/layout";
import Home from "@/pages/Home";
import Inbox from "@/pages/Inbox";
import Patients from "@/pages/Patients";
import Calendar from "@/pages/Calendar";
import { Games } from "@/pages/Games";
import Stats from "@/pages/Stats";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Session from "@/pages/Session";
import Login from "@/pages/auth/Login";
import PatientDetail from "@/pages/PatientDetail";
import NotFound from "@/pages/NotFound";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route for login */}
      <Route
        path="/login"
        element={<Login onLogin={() => setIsLoggedIn(true)} />}
      />

      {/* Protected routes - only accessible with valid token */}
      {isLoggedIn ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="patients" element={<Patients />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="games" element={<Games />} />
          <Route path="/session/:id" element={<Session />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="*" element={<NotFound />} /> {/* 404 route */}
        </Route>
      ) : (
        /* Redirect to login if not authenticated */
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
