from flask import Flask, request, jsonify
from PIL import Image
from utils import predict_image

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "AI Running"
    })

@app.route("/api/detect", methods=["POST"])
def detect():

    try:

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image uploaded"
            }), 400

        file = request.files["image"]

        img = Image.open(file.stream)

        result = predict_image(img)

        # RANDOM IMAGE CHECK
        is_plant = result["confidence"] >= 45

        return jsonify({
            "success": True,
            "isPlant": is_plant,
            "data": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)