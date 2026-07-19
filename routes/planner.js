const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many AI requests. Please wait a few minutes and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate", generateLimiter, async (req, res) => {  try {
    const { length, width, gardenType, preference, budget, city, soilType, weather } = req.body;

    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);

    if (!lengthNum || !widthNum || lengthNum <= 0 || widthNum <= 0) {
      return res.status(400).json({ error: "Plot length and width must be positive numbers." });
    }
    if (lengthNum > 1000 || widthNum > 1000) {
      return res.status(400).json({ error: "Plot dimensions seem too large. Please enter a realistic size in feet." });
    }
    if (!gardenType || !preference || !budget) {
      return res.status(400).json({ error: "Garden type, preference, and budget are required." });
    }

    console.log("Planner request received:", { length, width, gardenType, preference, budget, city, soilType, weather });

    const locationInfo = city
      ? `Location: ${city}, India`
      : `Location: India (general)`;

    const weatherInfo = weather
      ? `Current Weather: ${weather.temperature}°C, ${weather.description}, Humidity: ${weather.humidity}%`
      : "";

    const soilInfo = soilType && soilType !== "Don't know"
      ? `Soil Type: ${soilType}`
      : "";

    const prompt = `You are an expert Indian garden landscape designer. Create a detailed garden layout plan for the following:

Plot Size: ${length} x ${width} feet (${parseInt(length) * parseInt(width)} sq ft)
Garden Type: ${gardenType}
Plant Preference: ${preference}
Budget: ${budget}
${locationInfo}
${weatherInfo}
${soilInfo}

Consider the local climate zone for ${city || "India"} when recommending plants, planting seasons, and watering schedules. Account for the current weather conditions in your immediate recommendations.

LAYOUT INSTRUCTIONS: Imagine the plot as a 12x12 grid (144 cells) viewed from above, where col 0 is the left/west edge and row 0 is the top/back of the plot. For each zone, provide a "layout" object with integer grid coordinates: col (0-11, left position), row (0-11, top position), w (width in cells, 1-12), h (height in cells, 1-12). Place zones like a real landscape designer: put pathways as thin strips (w or h of 1-2) that connect areas, keep the lawn or largest area as one big block, tuck sitting/decorative areas into corners. Zones must NOT overlap, and every zone must fit fully inside the 12x12 grid (col + w <= 12 and row + h <= 12). Try to fill most of the grid. The total cell area of each zone should roughly match its share of the real square footage.

Please provide a comprehensive garden plan in the following JSON format only, no other text:
{
  "summary": "2-3 sentence overview of the garden plan, mentioning the location's climate",
  "zones": [
    {
      "name": "Zone name",
      "emoji": "relevant emoji",
      "area": "area in sq ft",
      "description": "what goes here",
      "plants": ["plant1", "plant2", "plant3"],
      "layout": { "col": 0, "row": 0, "w": 6, "h": 8 }
    }
  ],
  "plantList": [
    {
      "name": "Plant name",
      "quantity": "number",
      "spacing": "spacing in feet",
      "season": "best season to plant",
      "care": "one line care tip"
    }
  ],
  "monthlyCalendar": {
    "Jan-Feb": "what to do",
    "Mar-Apr": "what to do",
    "May-Jun": "what to do",
    "Jul-Aug": "what to do",
    "Sep-Oct": "what to do",
    "Nov-Dec": "what to do"
  },
  "tips": ["tip1", "tip2", "tip3", "tip4"],
  "estimatedCost": "cost range in INR",
  "wateringSchedule": "watering frequency and amount, considering current weather"
}`;

    console.log("Calling Claude API...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("Claude response status:", response.status);

    if (data.error) {
      console.error("Claude API error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    if (!data.content || !data.content[0]) {
      console.error("No content in response:", data);
      return res.status(500).json({ error: "No response from AI" });
    }

    if (data.stop_reason === "max_tokens") {
      console.error("Claude response was truncated (hit max_tokens).");
      return res.status(500).json({
        error: "AI response was cut off before completing. Try a smaller plot size, or we can raise the token limit further.",
      });
    }

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Failed to parse Claude response as JSON:", parseErr.message);
      console.error("Raw text from Claude:", text);
      return res.status(500).json({
        error: "AI returned a response that wasn't valid JSON. Please try again.",
      });
    }

    res.json(parsed);

  } catch (err) {
    console.error("Planner error:", err);
    res.status(500).json({ error: "Failed to generate plan", details: err.message });
  }
});

module.exports = router;