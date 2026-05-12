const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {

  try {

    const { lat, lon } = req.body;

    // OPEN METEO API
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode,precipitation_sum&current_weather=true&timezone=auto`;

    const response = await axios.get(url);

    const data = response.data;

    const currentTemp =
      data.current_weather.temperature;

    const weatherCode =
      data.current_weather.weathercode;

    // =========================
    // WEATHER CONDITION
    // =========================

    let condition = "Clear";

    if (weatherCode >= 50)
      condition = "Rain";

    if (weatherCode >= 80)
      condition = "Storm";

    // =========================
    // RISK LEVEL
    // =========================

    let riskLevel = "LOW";

    let alert = "Weather looks stable.";

    let advice =
      "Maintain regular irrigation.";

    if (condition === "Rain") {

      riskLevel = "MEDIUM";

      alert =
        "Humidity may increase fungal diseases.";

      advice =
        "Spray preventive fungicide.";

    }

    if (condition === "Storm") {

      riskLevel = "HIGH";

      alert =
        "Heavy storm risk detected.";

      advice =
        "Avoid irrigation and protect crops.";

    }

    // =========================
    // FORECAST
    // =========================

    const forecast = data.daily.time.map(
      (day, i) => ({

        day,

        temp:
          data.daily.temperature_2m_max[i],

        rain:
          data.daily.precipitation_sum[i],

        risk:
          data.daily.precipitation_sum[i] > 20
            ? "HIGH"
            : data.daily.precipitation_sum[i] > 5
            ? "MEDIUM"
            : "LOW"
      })
    );

    res.json({

      condition,

      temp: currentTemp,

      humidity: 70,

      wind: 12,

      riskLevel,

      alert,

      advice,

      forecast
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Weather failed"
    });
  }
});

module.exports = router;