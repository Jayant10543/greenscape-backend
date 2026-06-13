const express = require("express");
const router = express.Router();
const Plant = require("../models/plant");

router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const plant = await Plant.findOne({
      name: { $regex: new RegExp(req.params.name, "i") },
    });
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
});

router.post("/", async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ error: "Failed to add plant" });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await Plant.deleteMany();
    const plants = await Plant.insertMany(req.body);
    res.json({ message: plants.length + " plants seeded!" });
  } catch (err) {
    res.status(400).json({ error: "Seeding failed" });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
});

module.exports = router;