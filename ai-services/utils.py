import json
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# IMPORTANT
from tensorflow.keras.applications.mobilenet import preprocess_input

print("🚀 Loading Model...")

# FIX
model = load_model(
    "crop_model.keras",
    custom_objects={
        "preprocess_input": preprocess_input
    },
    compile=False
)

print("✅ Model Loaded")

# LOAD CLASSES
with open("class_names.json", "r") as f:
    class_names = json.load(f)

print("✅ Classes Loaded:", len(class_names))


def predict_image(img):

    # PIL IMAGE
    img = img.convert("RGB")

    # resize
    img = img.resize((224, 224))

    # array
    img_array = image.img_to_array(img)

    # batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    # IMPORTANT:
    # DO NOT preprocess again
    # because model already has Lambda(preprocess_input)

    predictions = model.predict(img_array, verbose=0)[0]

    pred_index = np.argmax(predictions)

    confidence = float(predictions[pred_index]) * 100

    label = class_names[pred_index]

    # SPLIT LABEL
    if "___" in label:
        crop, disease = label.split("___", 1)
    else:
        crop = label
        disease = "Unknown"

    crop = crop.replace("_", " ")
    disease = disease.replace("_", " ")

    status = (
        "HEALTHY"
        if "healthy" in disease.lower()
        else "DISEASED"
    )

    # TOP 3
    top3_idx = predictions.argsort()[-3:][::-1]

    top3 = []

    for i in top3_idx:

        top3.append({
            "label": class_names[i],
            "confidence": round(float(predictions[i] * 100), 2)
        })

    return {
        "crop": crop,
        "disease": disease,
        "status": status,
        "confidence": round(confidence, 2),
        "top3": top3
    }