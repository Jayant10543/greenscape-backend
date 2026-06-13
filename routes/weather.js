const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/coords", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    // Get proper city name using reverse geocoding
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();

    // Try to find the biggest/most known place from results
    const locationInfo = geoData[0];

    // Build city name — show name + state for clarity
    const placeName = locationInfo?.name || weatherData.name;
    const stateName = locationInfo?.state || "";
    const cityName = stateName ? `${placeName}, ${stateName}` : placeName;

    res.json({
      city: cityName,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      condition: weatherData.weather[0].main,
      windSpeed: weatherData.wind.speed,
      icon: weatherData.weather[0].icon,
    });

  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    });

  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

module.exports = router;