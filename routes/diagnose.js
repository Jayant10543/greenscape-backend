const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/analyze", express.json({ limit: "12mb" }), async (req, res) => {
  try {
    const { image, mediaType, plantName } = req.body;

    if (!image || typeof image !== "string" || image.trim().length < 100) {
      return res.status(400).json({ error: "No valid image provided. Please upload a photo." });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const finalMediaType = allowedTypes.includes(mediaType) ? mediaType : "image/jpeg";

    console.log("Disease detection request received. Plant name hint:", plantName || "(none)");

    const plantContext = plantName
      ? `The user says this is a ${plantName} plant. Trust this name and focus on diagnosing health/disease rather than re-identifying the species. `
      : "The user did NOT provide a plant name, so you'll need to identify the species yourself from the photo alone. ";

    const idInstruction = plantName
      ? `"plantIdentified": "${plantName}"`
      : `"plantIdentified": "your best guess, prefixed with 'Possibly' if you are not highly confident (e.g. 'Possibly Clivia (Bush Lily)') — identifying species from a single close-up photo is genuinely hard, so be honest about uncertainty rather than stating a guess as fact"`;

    const prompt = `You are an expert plant pathologist helping Indian home gardeners. ${plantContext}Look closely at this photo of a plant and assess its health.

Please respond in the following JSON format only, no other text:
{
  ${idInstruction},
  "plantIdentificationConfidence": "High, Medium, or Low (how sure are you about the species itself, separate from the disease confidence below)",
  "isHealthy": true or false,
  "disease": "name of the disease/pest/deficiency detected, or null if healthy",
  "confidence": "High, Medium, or Low (how sure are you about the disease/health assessment)",
  "symptoms": ["symptom1 visible in the photo", "symptom2"],
  "severity": "Mild, Moderate, or Severe (omit reasoning, just the word; null if healthy)",
  "cure": {
    "immediate": ["immediate action step 1", "immediate action step 2"],
    "ongoing": ["ongoing care step 1", "ongoing care step 2"]
  },
  "prevention": ["prevention tip 1", "prevention tip 2"],
  "organicTreatment": "a home-remedy / organic treatment option suited to Indian households, or null if healthy",
  "summary": "2-3 sentence plain-language summary of what's wrong and what to do, written for a beginner gardener"
}

Note: disease/symptom diagnosis is usually reliable even without species certainty, since symptoms like leaf spots, wilting, and discoloration are visually distinct. Don't let species uncertainty lower your confidence in the health assessment unless the photo itself is genuinely unclear.

If the photo does not clearly show a plant, or is too unclear to assess, set "disease" to "Unclear" and explain in "summary" what a better photo would need (e.g. closer to the leaves, better lighting).`;

    console.log("Calling Claude Vision API...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: finalMediaType,
                  data: image,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
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
        error: "AI response was cut off before completing. Please try again.",
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
    console.error("Disease detection error:", err);
    res.status(500).json({ error: "Failed to analyze plant photo", details: err.message });
  }
});

module.exports = router;