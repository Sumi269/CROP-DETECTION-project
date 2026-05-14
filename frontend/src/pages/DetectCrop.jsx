import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/detectCrop.css";

const DetectCrop = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= CAMERA =================

  const startCamera = async () => {

    try {

      setError("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      setCameraOn(true);

    } catch (err) {

      setError("❌ Camera permission denied");
    }
  };

  // ================= STOP CAMERA =================

  const stopCamera = () => {

    const stream = videoRef.current?.srcObject;

    if (stream) {

      stream.getTracks().forEach((t) => t.stop());
    }

    setCameraOn(false);
  };

  // ================= CAPTURE =================

  const captureImage = () => {

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {

        if (!blob) return;

        const img = new File(
          [blob],
          "crop.jpg",
          {
            type: "image/jpeg",
          }
        );

        setFile(img);

        const url =
          URL.createObjectURL(img);

        setPreview((prev) => {

          if (prev)
            URL.revokeObjectURL(prev);

          return url;
        });

      },
      "image/jpeg",
      0.95
    );
  };

  // ================= UPLOAD =================

  const handleUpload = (e) => {

    const f = e.target.files[0];

    if (!f) return;

    setFile(f);

    const url =
      URL.createObjectURL(f);

    setPreview((prev) => {

      if (prev)
        URL.revokeObjectURL(prev);

      return url;
    });
  };

  // ================= DETECT =================

  const handleDetect = async () => {

    if (!file) {

      setError(
        "Upload or capture image first"
      );

      return;
    }

    try {

      setLoading(true);

      setError("");
      setWarning("");
      setResult(null);

      const form = new FormData();

      form.append("image", file);

      const token =
        localStorage.getItem("token");

      const res = await API.post(
        "/api/detect",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // ================= WARNING =================

      if (res.data.warning) {

        setWarning(res.data.warning);
      }

      // ================= RESULT =================

      setResult(res.data.data);

      // ================= VOICE =================

      const speech =
        new SpeechSynthesisUtterance(
          `Crop ${res.data.data.crop}.
          Disease ${res.data.data.disease}.
          Status ${res.data.data.status}.
          Confidence ${Math.round(
            res.data.data.confidence
          )} percent.`
        );

      speech.lang = "en-US";

      window.speechSynthesis.speak(
        speech
      );

    } catch (err) {

  console.log("FULL ERROR:", err);

  console.log("SERVER:", err?.response?.data);

  setError(
    err?.response?.data?.error ||
    err.message ||
    "Detection failed"
  );
    }
}

  // ================= CLEANUP =================

  useEffect(() => {

    return () => {

      stopCamera();

      if (preview)
        URL.revokeObjectURL(preview);
    };

  }, [preview]);

  return (
    <>
      <Navbar />

      <div className="detect-page">

        <div className="detect-card">

          <h1>
            🌿 Crop Disease Detection
          </h1>

          <p className="subtitle">
            Upload or capture crop leaf image
          </p>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* WARNING */}

          {warning && (
            <div className="warning-box">
              {warning}
            </div>
          )}

          {/* CAMERA */}

          {cameraOn ? (

            <div className="camera-section">

              <video
                ref={videoRef}
                autoPlay
                className="camera"
              />

              <div className="btn-group">

                <button
                  onClick={captureImage}
                >
                  📸 Capture
                </button>

                <button
                  onClick={stopCamera}
                >
                  ❌ Stop
                </button>

              </div>

            </div>

          ) : (

            <button
              className="camera-btn"
              onClick={startCamera}
            >
              📷 Open Camera
            </button>
          )}

          {/* FILE */}

          <div className="upload-section">

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />

          </div>

          {/* PREVIEW */}

          {preview && (

            <div className="preview-section">

              <img
                src={preview}
                alt="preview"
                className="preview-image"
              />

            </div>
          )}

          {/* DETECT */}

          <button
            className="detect-btn"
            onClick={handleDetect}
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "🔍 Detect"}

          </button>

          {/* RESULT */}

          {result && (

            <div className="result-box">

              <h2>
                🌾 Detection Result
              </h2>

              <div className="result-grid">

                <div>
                  <span>Crop</span>
                  <h3>{result.crop}</h3>
                </div>

                <div>
                  <span>Disease</span>
                  <h3>{result.disease}</h3>
                </div>

                <div>
                  <span>Status</span>
                  <h3>{result.status}</h3>
                </div>

                <div>
                  <span>Confidence</span>

                  <h3>
                    {Math.round(
                      result.confidence
                    )}%
                  </h3>
                </div>
<div className="top3-box">

  <span>Top Predictions</span>

  {result.top3.map((item, index) => (

    <div key={index} className="top3-item">

      <p>
        {item.label.replace(/_/g, " ")}
      </p>

      <strong>
        {item.confidence}%
      </strong>

    </div>

  ))}

</div>
              </div>

            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

        </div>

      </div>
    </>
  );
};

export default DetectCrop;
