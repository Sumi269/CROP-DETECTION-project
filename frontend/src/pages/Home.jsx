import React from "react";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function Home(){

  const navigate = useNavigate();

  return(
    <div>

      <Navbar/>

      <div className="hero">

        <div className="hero-left">

          <h1>
            AI Powered Crop Disease Detection
          </h1>

          <p>
            Detect crop diseases instantly using Artificial Intelligence.
            Protect crops. Increase yield. Help farmers.
          </p>

          <div className="hero-buttons">

            <button onClick={()=>navigate('/detect')}>
              Start Detection
            </button>

            <button
              className="outline-btn"
              onClick={()=>navigate('/dashboard')}
            >
              View Dashboard
            </button>

          </div>

        </div>

        <div className="hero-right">
          🌱
        </div>

      </div>

      <div className="features">

        <div className="feature-card">
          <h2>⚡ AI Detection</h2>
          <p>Deep learning powered disease prediction.</p>
        </div>

        <div className="feature-card">
          <h2>📊 Analytics</h2>
          <p>Track crop health and disease trends.</p>
        </div>

        <div className="feature-card">
          <h2>🛡 Prevention</h2>
          <p>Get prevention and treatment suggestions.</p>
        </div>

      </div>

    </div>
  )
}