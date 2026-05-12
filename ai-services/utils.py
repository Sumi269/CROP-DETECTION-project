import json
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet import preprocess_input

# =========================
# LOAD MODEL
# =========================

print("🚀 Loading AI Model...")

model = load_model(

    "crop_model.keras",

    custom_objects={
        "preprocess_input": preprocess_input
    }

)

print("✅ Model Loaded Successfully")

# =========================
# LOAD CLASS NAMES
# =========================

with open("class_names.json", "r") as f:

    class_names = json.load(f)

print("✅ Classes Loaded:", len(class_names))

# =========================
# PREDICT FUNCTION
# =========================


def predict_image(img_input):
    """
    Works with:
    - file path (string)
    - PIL image (Flask upload)
    """

    # =========================
    # HANDLE INPUT SAFELY
    # =========================

    if isinstance(img_input, str):
        img = image.load_img(img_input, target_size=(224, 224))

    else:
        # PIL Image case (FIX FOR YOUR ERROR)
        img_input = img_input.convert("RGB")
        img = img_input.resize((224, 224))

    # =========================
    # CONVERT TO ARRAY
    # =========================

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    # preprocess_input works for both cases
    img_array = preprocess_input(img_array)

    # =========================
    # PREDICT
    # =========================

    predictions = model.predict(img_array)[0]

    pred_index = np.argmax(predictions)

    confidence = float(predictions[pred_index] * 100)

    full_label = class_names[pred_index]

    # =========================
    # SPLIT LABEL
    # =========================

    if "___" in full_label:
        crop, disease = full_label.split("___", 1)
    else:
        crop, disease = full_label, "Unknown"

    crop = crop.replace("_", " ").replace("(maize)", "").strip()
    disease = disease.replace("_", " ").strip()

    status = "HEALTHY" if "healthy" in disease.lower() else "DISEASED"

    # =========================
    # TOP 5 PREDICTIONS
    # =========================

    top5_idx = predictions.argsort()[-5:][::-1]

    top5 = []

    for i in top5_idx:
        label = class_names[i]

        if "___" in label:
            c, d = label.split("___", 1)
        else:
            c, d = label, "Unknown"

        top5.append({
            "crop": c.replace("_", " "),
            "disease": d.replace("_", " "),
            "confidence": round(float(predictions[i] * 100), 2)
        })

    return {
        "success": True,
        "crop": crop,
        "disease": disease,
        "status": status,
        "confidence": round(confidence, 2),
        "full_label": full_label,
        "top5": top5
    }