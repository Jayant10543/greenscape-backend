const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many AI requests. Please wait a few minutes and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const plantRoutes = require("./routes/plants");
app.use("/api/plants", plantRoutes);

app.get("/", (req, res) => {
  res.json({ message: "GreenScape AI Backend is running!" });
});

const weatherRoutes = require("./routes/weather");
app.use("/api/weather", weatherRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const plannerRoutes = require("./routes/planner");
app.use("/api/planner", aiLimiter, plannerRoutes);

const diagnoseRoutes = require("./routes/diagnose");
app.use("/api/diagnose", aiLimiter, diagnoseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });