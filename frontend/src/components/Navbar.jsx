import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar(){

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return(
    <div className="navbar">

      <div className="logo">
        🌾 Agri AI
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/detect">Detect</Link>

        <Link to="/history">History</Link>

        <Link to="/admin">Admin</Link>
        <Link to="/Chat">Chatbot</Link>
        <Link to="/weather">WeatherAlert</Link>


        <Link to="/profile">Profile</Link>

        {
          user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )
        }

      </div>

    </div>
  )
}