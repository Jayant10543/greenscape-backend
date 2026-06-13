const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latin: { type: String },
  image: { type: String },
  tags: [String],
  category: { type: String },
  difficulty: { type: String },
  climate: { type: String },
  sunlight: { type: String },
  water: { type: String },
  height: { type: String },
  growTime: { type: String },
  soil: { type: String },
  season: { type: String },
  states: { type: String },
  uses: [String],
  care: {
    watering: String,
    fertilizer: String,
    pruning: String,
    repotting: String,
  },
  diseases: [
    {
      name: String,
      risk: String,
    },
  ],
  description: { type: String },
});

module.exports = mongoose.model("Plant", plantSchema);