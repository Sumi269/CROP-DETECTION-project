const express = require("express");
const router = express.Router();

const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const { authMiddleware } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  authMiddleware,
  upload.single("image"),

  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image uploaded"
        });
      }

      const form = new FormData();

      form.append(
        "image",
        fs.createReadStream(req.file.path)
      );
const response = await axios.post(
      "https://crop-detection-project-3.onrender.com/api/detect",
        form,
        {
          headers: form.getHeaders()
        }
      );

      return res.json(response.data);

    } catch (err) {

      console.log(err.message);

      return res.status(500).json({
        success: false,
        error: "AI detection failed"
      });
    }
  }
);

module.exports = router;
