from flask import Flask, request, jsonify
from PIL import Image
import traceback
from utils import predict_image

app = Flask(__name__)

history = []

@app.route("/", methods=["GET"])
def home():
    return jsonify({"success": True, "message": "AI Running"})

# =========================
# FIXED DETECT ROUTE
# =========================
@app.route("/api/detect", methods=["POST"])
def detect():

    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image"}), 400

        file = request.files["image"]
        img = Image.open(file.stream).convert("RGB")

        result = predict_image(img)

        entry = {
            "crop": result["crop"],
            "disease": result["disease"],
            "status": result["status"],
            "confidence": result["confidence"]
        }

        # prevent duplicates
        if len(history) == 0 or history[-1] != entry:
            history.append(entry)

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# HISTORY FIXED
# =========================
@app.route("/detect/history", methods=["GET"])
def get_history():
    return jsonify({
        "success": True,
        "history": history
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)