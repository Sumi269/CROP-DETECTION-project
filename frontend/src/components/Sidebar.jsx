import React from "react";
import { Link, useLocation } from "react-router-dom";

import "../styles/sidebar.css";

export default function Sidebar() {

  const location = useLocation();

  return (
    <div className="sidebar">

      <h2 className="sidebar-logo">
        🌱 Agri AI
      </h2>

      <div className="sidebar-links">

        <Link
          className={
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }
          to="/dashboard"
        >
          📊 Dashboard
        </Link>

        <Link
          className={
            location.pathname === "/detect"
              ? "active"
              : ""
          }
          to="/detect"
        >
          🍃 Detect
        </Link>

        <Link
          className={
            location.pathname === "/history"
              ? "active"
              : ""
          }
          to="/history"
        >
          📜 History
        </Link>

        <Link
          className={
            location.pathname === "/chat"
              ? "active"
              : ""
          }
          to="/chat"
        >
          🤖 AI Chat
        </Link>

        <Link
          className={
            location.pathname === "/weather"
              ? "active"
              : ""
          }
          to="/weather"
        >
          ☁ Weather
        </Link>

        <Link
          className={
            location.pathname === "/admin"
              ? "active"
              : ""
          }
          to="/admin"
        >
          🛠 Admin
        </Link>

        <Link
          className={
            location.pathname === "/profile"
              ? "active"
              : ""
          }
          to="/profile"
        >
          👤 Profile
        </Link>
<button
  className="logout-btn"
  onClick={() => {

    localStorage.clear();

    window.location.href = "/login";

  }}
>
  Logout
</button>
      </div>

    </div>
  );
}