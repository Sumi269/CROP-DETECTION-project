from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from utils import predict_image
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "🌾 Crop Detection AI Running"
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

        img = Image.open(file.stream).convert("RGB")

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
# RUN SERVER
# =========================
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5001))

    app.run(
        host="0.0.0.0",
        port=port
    )
