import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/admin.css";

export default function Admin() {

  const [data, setData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/api/admin/all");

      setData(res.data.predictions || []);
      setTotalUsers(res.data.totalUsers || 0);

    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deletePrediction = async (id) => {
    try {
      await API.delete(`/api/admin/delete/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // UNIQUE CROPS ONLY
  const uniqueData = Array.from(
    new Map(
      data.map(item => [
        item.crop + item.disease,
        item
      ])
    ).values()
  );

  return (
    <>
      <Navbar />

      <div className="admin-page">

        <h1>🧑‍💼 Admin Panel</h1>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <h2>{data.length}</h2>
            <p>Total Records</p>
          </div>

          <div className="stat-card">
            <h2>{uniqueData.length}</h2>
            <p>Unique Predictions</p>
          </div>

          <div className="stat-card">
            <h2>{totalUsers}</h2>
            <p>Total Users</p>
          </div>

        </div>

        {/* CARDS */}
        <div className="admin-grid">

          {uniqueData.map((item, i) => (

            <div className="admin-card" key={i}>

              {/* IMAGE */}
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt=""
                className="admin-img"
              />

              {/* INFO */}
              <div className="admin-info">

                <h3>{item.crop}</h3>
                <p>{item.disease}</p>

                <p>Status: {item.status}</p>
                <p>Confidence: {item.confidence}%</p>

                {/* USER */}
                <div>
                  <b>User:</b> {item.user?.name}
                </div>

                <button
                  onClick={() => deletePrediction(item._id)}
                  className="delete-btn"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}