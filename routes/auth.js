const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "greenscape_secret_key";

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      city: city || "Agra",
      savedPlants: [],
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        gardenType: user.gardenType,
        soilType: user.soilType,
        maintenance: user.maintenance,
        savedPlants: user.savedPlants,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        gardenType: user.gardenType,
        soilType: user.soilType,
        maintenance: user.maintenance,
        savedPlants: user.savedPlants || [],
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// UPDATE PROFILE
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { gardenType, soilType, maintenance, city } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { gardenType, soilType, maintenance, city },
      { new: true }
    );

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      gardenType: user.gardenType,
      soilType: user.soilType,
      maintenance: user.maintenance,
      savedPlants: user.savedPlants || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// GET PROFILE
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// SAVE / UNSAVE A PLANT
router.post("/save-plant", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { plantId } = req.body;

    if (!plantId) return res.status(400).json({ error: "plantId is required" });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure savedPlants exists
    if (!user.savedPlants) user.savedPlants = [];

    if (user.savedPlants.includes(plantId)) {
      // Remove if already saved
      user.savedPlants = user.savedPlants.filter((id) => id !== plantId);
    } else {
      // Add if not saved
      user.savedPlants.push(plantId);
    }

    await user.save();
    res.json({ savedPlants: user.savedPlants });
  } catch (err) {
    console.error("Save plant error:", err);
    res.status(500).json({ error: "Failed to save plant", details: err.message });
  }
});

module.exports = router;