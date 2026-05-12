const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const { authMiddleware } =
require("../middleware/auth");

const Prediction =
require("../models/Prediction");

// ====================================
// CREATE UPLOADS FOLDER
// ====================================

const uploadPath =
path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(uploadPath, {
    recursive: true
  });
}

// ====================================
// MULTER STORAGE
// ====================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowed =
      /jpeg|jpg|png|webp/;

    const ext =
      allowed.test(
        path.extname(file.originalname)
        .toLowerCase()
      );

    const mime =
      allowed.test(file.mimetype);

    if (ext && mime) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only JPG PNG WEBP images allowed"
        )
      );
    }
  }
});

// ====================================
// DETECT ROUTE
// ====================================

router.post(

  "/",

  authMiddleware,

  upload.single("image"),

  async (req, res) => {

    try {

      // ============================
      // IMAGE CHECK
      // ============================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          error: "No image uploaded"
        });
      }

      // ============================
      // FLASK URL CHECK
      // ============================

      if (!process.env.FLASK_API) {

        return res.status(500).json({

          success: false,

          error:
            "FLASK_API missing in .env"
        });
      }

      // ============================
      // SEND TO FLASK AI
      // ============================

      const formData =
      new FormData();

      formData.append(

        "image",

        fs.createReadStream(
          req.file.path
        )
      );

      const response =
      await axios.post(

        process.env.FLASK_API,

        formData,

        {

          headers:
            formData.getHeaders(),

          maxBodyLength: Infinity,

          maxContentLength: Infinity
        }
      );

      const ai = response.data;

      console.log(
        "AI RESPONSE:",
        ai
      );

      // ============================
      // AI ERROR CHECK
      // ============================

      if (ai.error) {

        return res.status(500).json({

          success: false,

          error: ai.error
        });
      }

      // ============================
      // SEVERITY
      // ============================

      let severity = "Low";

      if (ai.confidence >= 85) {

        severity = "High";

      } else if (
        ai.confidence >= 60
      ) {

        severity = "Medium";
      }

      // ============================
      // ADVICE
      // ============================

      let advice = "";

      let explanation = "";

      if (
        ai.status &&
        ai.status
          .toLowerCase()
          .includes("healthy")
      ) {

        advice =
          "Crop looks healthy. Continue proper irrigation and fertilizer management.";

        explanation =
          "AI found healthy leaf texture and natural coloration.";

      } else {

        advice =
          "Disease detected. Remove infected leaves and apply recommended fungicide or pesticide.";

        explanation =
          "AI identified abnormal disease patterns on crop leaf.";
      }

      // ============================
      // DUPLICATE CHECK
      // ============================

      const existing =
      await Prediction.findOne({

        user: req.user.id,

        crop: ai.crop,

        disease: ai.disease,

        fullLabel: ai.full_label
      });

      if (existing) {

        return res.json({

          success: true,

          duplicate: true,

          message:
            "Already exists in history",

          data: existing
        });
      }

      // ============================
      // SAVE DATABASE
      // ============================

      const newPrediction =
      new Prediction({

        user: req.user.id,

        crop: ai.crop,

        disease: ai.disease,

        status: ai.status,

        confidence: ai.confidence,

        severity,

        advice,

        explanation,

        image: req.file.filename,

        fullLabel:
          ai.full_label,

        top5:
          ai.top5 || []
      });

      await newPrediction.save();

      // ============================
      // FINAL RESPONSE
      // ============================
return res.json({
  success: true,
  data: {
    crop: ai.crop,
    disease: ai.disease,
    status: ai.status,
    confidence: ai.confidence,
    severity,
    advice,
    explanation,
    image: req.file.filename,
    fullLabel: ai.full_label,
    top5: ai.top5 || []
  }
});

    } catch (err) {

      console.log(
        "DETECTION ERROR:",
        err.message
      );

      return res.status(500).json({

        success: false,

        error:
          err.response?.data?.error ||
          err.message ||
          "Detection failed"
      });
    }
  }
);

// ====================================
// USER HISTORY
// ====================================

// ====================================
// HISTORY
// ====================================

router.get(

  "/history",

  authMiddleware,

  async (req, res) => {

    try {

      const history =
        await Prediction.find({

          user: req.user.id

        })

        .sort({ createdAt: -1 });

      res.json({

        success: true,

        history

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        error: err.message
      });
    }
  }
);

// ====================================
// DELETE HISTORY
// ====================================

router.delete(

  "/history/:id",

  authMiddleware,

  async (req, res) => {

    try {

      const item =
      await Prediction.findById(
        req.params.id
      );

      if (!item) {

        return res.status(404).json({

          success: false,

          error:
            "Prediction not found"
        });
      }

      // only owner can delete

      if (
        item.user.toString() !==
        req.user.id
      ) {

        return res.status(403).json({

          success: false,

          error:
            "Unauthorized"
        });
      }

      // delete image

      const imagePath =
      path.join(

        uploadPath,

        item.image
      );

      if (
        fs.existsSync(imagePath)
      ) {

        fs.unlinkSync(imagePath);
      }

      await item.deleteOne();

      res.json({

        success: true,

        message:
          "History deleted successfully"
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error: err.message
      });
    }
  }
);

module.exports = router;