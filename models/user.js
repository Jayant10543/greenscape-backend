const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, default: "Agra" },
  gardenType: { type: String, default: "" },
  soilType: { type: String, default: "" },
  maintenance: { type: String, default: "" },
  savedPlants: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);