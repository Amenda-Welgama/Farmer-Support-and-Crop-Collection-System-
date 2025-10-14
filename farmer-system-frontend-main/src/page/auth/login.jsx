// pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Submitting login form:", form);

      const response = await axios.post(
        "http://localhost:5000/api/users/auth/login",
        form
      );

      console.log("Full server response:", response);

      const token = response.data.token;
      const user = response.data.user;

      console.log("Received token:", token);
      console.log("Received user data:", user);

      if (user && token) {
        login(user);
        localStorage.setItem("token", token);

        console.log("User role:", user.role);
        if (user.role === "admin") {
          console.log("Navigating to /admin");
          navigate("/admin");
        } else {
          console.log("Navigating to /user");
          navigate("/user");
        }
      } else {
        const errorMessage =
          response.data.message ||
          "Login failed: No token or user data received.";
        console.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error(
        "An error occurred during login:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    console.log("Context user changed:", user);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          Farmer System Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
