const express = require("express");
const Prediction = require("../models/Prediction");

const router = express.Router();

// CHART DATA
router.get("/stats", async (req, res) => {
  const total = await Prediction.countDocuments();
  const diseased = await Prediction.countDocuments({ status: "DISEASED" });

  const crops = await Prediction.aggregate([
    { $group: { _id: "$crop", count: { $sum: 1 } } }
  ]);

  res.json({
    total,
    healthy: total - diseased,
    diseased,
    crops
  });
});

module.exports = router;