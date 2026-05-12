const express = require("express");
const router = express.Router();

// =============================
// LOCAL FARMING AI
// =============================
function getLocalReply(message) {

  const msg = message.toLowerCase();

  // fungus
  if (
    msg.includes("fungus") ||
    msg.includes("fungal")
  ) {
    return `
🌱 How to prevent crop fungus:

1. Avoid overwatering
2. Ensure proper sunlight
3. Remove infected leaves
4. Maintain plant spacing
5. Improve air circulation
6. Use neem oil spray
7. Use copper fungicide if needed
`;
  }

  // fertilizer
  if (msg.includes("fertilizer")) {
    return `
🌾 Fertilizer Tips:

• Nitrogen → leaf growth
• Phosphorus → root growth
• Potassium → fruit quality

Use organic compost whenever possible.
`;
  }

  // irrigation
  if (msg.includes("irrigation")) {
    return `
💧 Irrigation Tips:

• Water early morning
• Avoid overwatering
• Use drip irrigation
• Maintain soil moisture
`;
  }

  // tomato
  if (msg.includes("tomato")) {
    return `
🍅 Tomato Farming Tips:

• Requires 6-8 hours sunlight
• Avoid excess water
• Use potassium fertilizer
• Protect from leaf spot disease
`;
  }

  // potato
  if (msg.includes("potato")) {
    return `
🥔 Potato Farming Tips:

• Use well-drained soil
• Avoid waterlogging
• Monitor late blight disease
• Use certified seeds
`;
  }

  // default
  return `
🌾 Ask me about:
• Crops
• Diseases
• Fertilizers
• Irrigation
• Weather
• Fungus prevention
`;
}

// =============================
// CHAT ROUTE
// =============================
router.post("/", async (req, res) => {

  try {

    console.log("CHAT REQUEST:", req.body);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message required"
      });
    }

    // LOCAL AI RESPONSE
    const reply = getLocalReply(message);

    return res.json({
      success: true,
      reply
    });

  } catch (err) {

    console.log("CHAT ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

module.exports = router;