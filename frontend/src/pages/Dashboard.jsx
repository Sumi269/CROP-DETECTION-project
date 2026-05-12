import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

export default function Dashboard() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/api/admin/all");
    setData(res.data.predictions || []);
  };

  const unique = Array.from(
    new Map(data.map(i => [i.crop + i.disease, i])).values()
  );

  const healthy = unique.filter(i => i.status === "HEALTHY").length;
  const diseased = unique.filter(i => i.status === "DISEASED").length;

  const pieData = [
    { name: "Healthy", value: healthy },
    { name: "Diseased", value: diseased }
  ];

  const cropMap = {};
  unique.forEach(i => {
    cropMap[i.crop] = (cropMap[i.crop] || 0) + 1;
  });

  const barData = Object.keys(cropMap).map(k => ({
    crop: k,
    count: cropMap[k]
  }));

  return (
    <>
      <Navbar />

      <div>
        <h1>Dashboard</h1>
        <h2>Total Predictions: {data.length}</h2>
        <h2>Unique Crops: {unique.length}</h2>
        <h2>Healthy: {healthy}</h2>
        <h2>Diseased: {diseased}</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={100} label>
              <Cell fill="#22c55e" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid />
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}