import React, { useState } from "react";
import axios from "axios";

export default function UpdateUserForm({ user, onClose, refresh, setRefresh }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !address || !phone || !role) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${user.userId}`,
        {
          name,
          email,
          address,
          phone,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("User updated successfully");
      setError("");
      setRefresh(!refresh);
      onClose(); // close modal after update
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

        <h2 className="text-xl font-semibold text-green-600 mb-4">Edit User</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Address"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            placeholder="Phone"
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Update User
          </button>
        </form>

        {/* Error & Success messages */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mt-2 text-center">{success}</p>
        )}
      </div>
    </div>
  );
}
