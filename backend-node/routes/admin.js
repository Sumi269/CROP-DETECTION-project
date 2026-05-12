const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");

// ================= GET ALL =================
router.get("/all", async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, predictions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= DELETE =================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Prediction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;