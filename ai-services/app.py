from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from utils import predict_image
import os

app = Flask(__name__)

# =========================
# CORS
# =========================
CORS(app)

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "🌾 Crop Detection AI Running Successfully"
    })

# =========================
# HEALTH CHECK ROUTE
# =========================
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })

# =========================
# DETECT ROUTE
# =========================
@app.route("/api/detect", methods=["POST"])
def detect():

    try:

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image uploaded"
            }), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({
                "success": False,
                "error": "Empty file"
            }), 400

        # OPEN IMAGE
        img = Image.open(file.stream).convert("RGB")

        # AI PREDICTION
        result = predict_image(img)

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# =========================
# RENDER SERVER
# =========================
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 10000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
