// UpdateCategoryForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function UpdateCategoryForm({ category, onClose, refresh, setRefresh }) {
  const [categoryName, setCategoryName] = useState(category?.categoryName || "");
  const [description, setDescription] = useState(category?.description || "");
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
      await axios.put(
        `http://localhost:5000/api/categories/${category.categoryId}`,
        { categoryName, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Category updated successfully");
      setError("");
      setRefresh(!refresh);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-green-600 mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            placeholder="Category Name"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description (optional)"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Update Category
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}
      </div>
    </div>
  );
}
