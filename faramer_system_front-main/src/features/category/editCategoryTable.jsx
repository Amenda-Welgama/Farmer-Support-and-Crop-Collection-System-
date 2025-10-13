// EditCategoryTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateCategoryForm from "../category/updateCategoryForm";

const EditCategoryTable = ({ refresh, setRefresh }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategoryData(res.data))
      .catch((err) => console.error("Error fetching category data:", err));
  };

  // Delete category
  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:5000/api/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => fetchCategories())
        .catch((err) => console.error("Error deleting category:", err));
    }
  };

  // Open modal to edit
  const handleEdit = (category) => setSelectedCategory(category);

  return (
    <div className="overflow-x-auto p-4 py-5">
      <div className="inline-block h-80 overflow-y-scroll min-w-full rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Category Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categoryData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categoryData.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{category.categoryId}</td>
                  <td className="px-6 py-4">{category.categoryName}</td>
                  <td className="px-6 py-4">{category.description || "-"}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedCategory && (
        <UpdateCategoryForm
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default EditCategoryTable;
