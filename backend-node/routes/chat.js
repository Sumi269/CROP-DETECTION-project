const express = require("express");
const router = express.Router();
const axios = require("axios");
const { authMiddleware } = require("../middleware/auth");

// =============================
// GOOGLE SEARCH FUNCTION
// =============================

async function searchGoogle(query) {
  const API_KEY = process.env.SERPAPI_KEY;

  const url = `https://serpapi.com/search.json?q=${query}&api_key=${API_KEY}`;

  const res = await axios.get(url);

  const results = res.data.organic_results || [];

  return results.slice(0, 5).map(item => ({
    title: item.title,
    snippet: item.snippet,
    link: item.link
  }));
}

// =============================
// CHAT API
// =============================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    // 🌐 STEP 1: SEARCH INTERNET
    const results = await searchGoogle(message);

    // 🧠 STEP 2: FORMAT LIKE CHATGPT
    const reply = results.map(r =>
      `📌 ${r.title}\n${r.snippet}\n🔗 ${r.link}\n`
    ).join("\n");

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Chat failed"
    });
  }
});

module.exports = router;