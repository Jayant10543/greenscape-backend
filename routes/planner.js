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
console.log("Claude response:", JSON.stringify(data));

if (data.error) {
  console.error("Claude API error:", data.error);
  return res.status(500).json({ error: data.error.message });
}

const text = data.content[0].text;