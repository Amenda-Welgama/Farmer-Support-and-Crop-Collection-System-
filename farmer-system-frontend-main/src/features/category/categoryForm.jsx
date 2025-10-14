import React, { useState } from "react";
import axios from "axios";

export default function CategoryForm({ refresh, setRefresh }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setError("Category name is required");
      setSuccess("");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/categories",
        {
          categoryName,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Category created successfully");
      setError("");
      setCategoryName("");
      setDescription("");

      setRefresh(!refresh);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="grid my-3 border border-green-600 rounded-2xl p-8 grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          type="text"
          placeholder="Category Name"
          className="p-3 h-10 w-full border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Description (optional)"
          className="p-3 h-10 w-full border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="sm:col-span-2 w-full h-10 bg-green-500 text-white p-1 rounded-lg hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center">{success}</p>}
    </div>
  );
}
