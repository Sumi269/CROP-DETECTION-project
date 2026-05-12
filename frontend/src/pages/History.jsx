import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/history.css";

export default function History() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/admin/all");

      // REMOVE DUPLICATES (crop + disease wise)
      const unique = Array.from(
        new Map(
          (res.data.predictions || []).map(item => [
            item.crop + item.disease,
            item
          ])
        ).values()
      );

      setData(unique);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="history-page">

        <h1>🌿 Detection History</h1>

        {loading ? (
          <div className="loading">
            Loading history...
          </div>
        ) : (

          <div className="history-list">

            {data.length === 0 ? (
              <p>No history found</p>
            ) : (

              data.map((item, i) => (

                <div className="history-card" key={i}>

                  {/* IMAGE SIDE */}
                  <div className="history-image">

                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt="crop"
                    />

                    <div
                      className={`status-badge ${
                        item.status === "HEALTHY"
                          ? "status-healthy"
                          : "status-diseased"
                      }`}
                    >
                      {item.status}
                    </div>

                  </div>

                  {/* DETAILS SIDE */}
                  <div className="history-details">

                    <h2>{item.crop}</h2>
                    <h3>{item.disease}</h3>

                    <div className="info-grid">

                      <div className="info-box">
                        🎯 Confidence: {item.confidence}%
                      </div>

                      <div className="info-box">
                        ⚠️ Severity: {item.severity}
                      </div>

                    </div>

                    <div className="advice-box">
                      🤖 AI Advice: {item.advice}
                    </div>

                    <div className="time-box">
                      📅 {new Date(item.createdAt).toLocaleString()}
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        )}

      </div>
    </>
  );
}