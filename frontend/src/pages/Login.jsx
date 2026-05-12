import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "../styles/login.css";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        form
      );

      // TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");

    } catch (err) {

      alert(
        err.response?.data?.error ||
        "Login failed"
      );

    }
  };

  return (
    <div className="login-page">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h1>🌱 Agri AI Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}