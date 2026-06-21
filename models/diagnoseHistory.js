const mongoose = require("mongoose");

const diagnoseHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  image: { type: String, required: true },
  mediaType: { type: String, default: "image/jpeg" },
  plantNameInput: { type: String, default: "" },

  plantIdentified: { type: String },
  plantIdentificationConfidence: { type: String },
  isHealthy: { type: Boolean },
  disease: { type: String },
  confidence: { type: String },
  symptoms: [{ type: String }],
  severity: { type: String },
  cure: {
    immediate: [{ type: String }],
    ongoing: [{ type: String }],
  },
  prevention: [{ type: String }],
  organicTreatment: { type: String },
  summary: { type: String },

  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("DiagnoseHistory", diagnoseHistorySchema);