router.get("/all", async (req, res) => {
  try {
    const data = await Prediction.find()
      .populate("user")
      .sort({ createdAt: -1 });

    const users = await Prediction.distinct("user");

    res.json({
      success: true,
      predictions: data,
      totalUsers: users.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});