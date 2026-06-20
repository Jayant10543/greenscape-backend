const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/api/planner", plannerRoutes);

const diagnoseRoutes = require("./routes/diagnose");
app.use("/api/diagnose", diagnoseRoutes);

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