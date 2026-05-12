import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import "../styles/weatherDashboard.css";

export default function Weather() {

  const [weather, setWeather] =
    useState(null);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const { latitude, longitude } =
          position.coords;

        const res = await fetch(

          "http://localhost:5000/api/weather",

          {
            method:"POST",

            headers:{
              "Content-Type":
              "application/json"
            },

            body:JSON.stringify({

              lat: latitude,
              lon: longitude
            })
          }
        );

        const data =
          await res.json();

        setWeather(data);
      }
    );

  }, []);

  if(!weather){

    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="weather-page">

        <div className="weather-card">

          <h1>
            🌦 Smart Weather AI
          </h1>

          <div className="main-weather">

            <h2>
              {weather.condition}
            </h2>

            <div className="temp">

              {weather.temp}°C

            </div>

          </div>

          <div className="risk-box">

            Risk Level:
            {" "}
            <span>
              {weather.riskLevel}
            </span>

          </div>

          <div className="alert-box">

            {weather.alert}

          </div>

          <div className="forecast-grid">

            {weather.forecast.map(
              (day, index) => (

              <div
                className="forecast-card"
                key={index}
              >

                <h3>
                  {day.day}
                </h3>

                <p>
                  Temp:
                  {" "}
                  {day.temp}°C
                </p>

                <p>
                  Rain:
                  {" "}
                  {day.rain}
                </p>

                <span className={day.risk}>
                  {day.risk}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    </>
  );
}