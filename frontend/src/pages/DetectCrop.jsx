import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/detectCrop.css";

const DetectCrop = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // ================= CAMERA START =================
  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      setError("Camera permission denied. Please allow camera access.");
    }
  };

  // ================= STOP CAMERA =================
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setCameraOn(false);
  };

  // ================= CAPTURE IMAGE =================
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", {
        type: "image/jpeg",
      });

      setSelectedFile(file);
      setCapturedImage(URL.createObjectURL(blob));
    }, "image/jpeg");
  };

  // ================= FILE UPLOAD =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setCapturedImage(URL.createObjectURL(file));
  };

  // ================= DETECT API =================
  const handleDetect = async () => {
    if (!selectedFile) {
      setError("Please upload or capture image first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("token");

      const res = await API.post("/api/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.success) {
        setError(res.data.error || "Detection failed");
        return;
      }

      setResult(res.data.data);

      // voice
      const speech = new SpeechSynthesisUtterance(
        `Crop ${res.data.data.crop}. Disease ${res.data.data.disease}. Status ${res.data.data.status}. Confidence ${Math.round(
          res.data.data.confidence
        )} percent.`
      );

      window.speechSynthesis.speak(speech);
    } catch (err) {
      setError(err?.response?.data?.error || "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <>
      <Navbar />

      <div className="detect-page">
        <div className="detect-card">

          <h1>🌿 AI Crop Disease Detection</h1>
          <p>Upload or capture crop leaf image for instant AI analysis</p>

          {/* ERROR */}
          {error && <div className="error-box">{error}</div>}

          {/* CAMERA */}
          <div className="camera-section">
            {cameraOn ? (
              <>
                <video ref={videoRef} autoPlay className="camera-video" />

                <div className="btn-group">
                  <button onClick={captureImage}>📸 Capture</button>
                  <button onClick={stopCamera}>❌ Stop</button>
                </div>
              </>
            ) : (
              <button className="camera-btn" onClick={startCamera}>
                📷 Start Camera
              </button>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* UPLOAD */}
          <div className="upload-section">
            <label className="upload-box">
              📁 Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
          </div>

          {/* PREVIEW */}
          {capturedImage && (
            <div className="preview-section">
              <img src={capturedImage} alt="preview" className="preview-image" />
            </div>
          )}

          {/* DETECT BUTTON */}
          <button
            className="detect-btn"
            onClick={handleDetect}
            disabled={loading}
          >
            {loading ? "Analyzing Crop..." : "🔍 Detect Disease"}
          </button>

          {/* RESULT */}
          {result && (
            <div className="result-box">
              <h2>🌾 Detection Result</h2>

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
                  <h3>{Math.round(result.confidence)}%</h3>
                </div>
              </div>

              <div className="advice-box">
                <h3>💡 AI Advice</h3>
                <p>{result.advice}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default DetectCrop;