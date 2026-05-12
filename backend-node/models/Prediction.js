const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    crop: String,
    disease: String,
    status: String,
    confidence: Number,
    severity: String,
    advice: String,
    image: String,
    fullLabel: String,
    top5: Array
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);