const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/generate", async (req, res) => {
  try {
    const { length, width, gardenType, preference, budget } = req.body;

    console.log("Planner request received:", { length, width, gardenType, preference, budget });

    const prompt = `You are an expert Indian garden landscape designer. Create a detailed garden layout plan for the following:

Plot Size: ${length} x ${width} feet (${parseInt(length) * parseInt(width)} sq ft)
Garden Type: ${gardenType}
Plant Preference: ${preference}
Budget: ${budget}
Location: India (tropical/subtropical climate)

Please provide a comprehensive garden plan in the following JSON format only, no other text:
{
  "summary": "2-3 sentence overview of the garden plan",
  "zones": [
    {
      "name": "Zone name",
      "emoji": "relevant emoji",
      "area": "area in sq ft",
      "description": "what goes here",
      "plants": ["plant1", "plant2", "plant3"]
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
  "wateringSchedule": "watering frequency and amount"
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
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("Claude response status:", response.status);
    console.log("Claude response data:", JSON.stringify(data));

    if (data.error) {
      console.error("Claude API error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    if (!data.content || !data.content[0]) {
      console.error("No content in response:", data);
      return res.status(500).json({ error: "No response from AI" });
    }

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error("Planner error:", err);
    res.status(500).json({ error: "Failed to generate plan", details: err.message });
  }
});

module.exports = router;