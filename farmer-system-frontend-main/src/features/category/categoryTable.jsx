import axios from "axios";
import React, { useEffect, useState } from "react";

const CategoryTable = ({ refresh }) => {
  const [categoryData, setCategoryData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("Category data fetched successfully:", res.data);
          setCategoryData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, [refresh]);

  return (
    <div className="overflow-x-auto p-4">
      <div className="inline-block h-80 overflow-y-scroll min-w-full rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Category Name</th>
              <th className="px-6 py-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categoryData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categoryData.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{category.categoryId}</td>
                  <td className="px-6 py-4">{category.categoryName}</td>
                  <td className="px-6 py-4">{category.description || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
