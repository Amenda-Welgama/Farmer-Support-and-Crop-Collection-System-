import React, { useState } from "react";
import axios from "axios";

export default function UsersForm({ refresh, setRefresh }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !address || !phone || !password || !role) {
      setError("All fields are required");
      setSuccess("");
      return;
    }

    try {
       await axios.post(
        "http://localhost:5000/api/users/auth/register",
        {
          name,
          email,
          address,
          phone,
          password,
          role,
        }
      );

      setSuccess("User created successfully");
      setError("");

      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
      setPassword("");
      setRole("");

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
        className="grid my-3 border border-green-600 rounded-2xl p-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="p-3 h-8 w-68 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="p-3 h-8 w-68 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          placeholder="Address"
          className="p-3 h-8 w-68 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          placeholder="Phone"
          className="p-3 h-8 w-68 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="p-3 h-8 w-68 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 h-8 w-full text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button
          type="submit"
          className="w-30 h-8 bg-green-500 text-white p-1 rounded-lg hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-600 text-sm text-center">{success}</p>}
    </div>
  );
}
