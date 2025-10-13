import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaHourglassHalf,
  FaCheckCircle,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

export default function Dashboard() {
  const API = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
    pending: 0,
    completed: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const fetchWithAuth = (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetchWithAuth(`${API}/users`),
      fetchWithAuth(`${API}/products`),
      fetchWithAuth(`${API}/categories`),
      fetchWithAuth(`${API}/orders`),
      fetchWithAuth(`${API}/orders/pending`),
      fetchWithAuth(`${API}/orders/completed`),
    ])
      .then(([users, products, categories, orders, pending, completed]) => {
        setStats({
          users: users.length || 0,
          products: products.length || 0,
          categories: categories.length || 0,
          orders: orders.length || 0,
          pending: pending.length || 0,
          completed: completed.length || 0,
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentOrders(orders.slice(-5).reverse());
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200">
        <p className="text-red-600 font-semibold bg-white px-6 py-3 rounded-xl shadow-md">
          ⚠️ Please login first to view dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <h1 className="text-xl font-bold mb-8 text-green-700 flex items-center gap-2">
        <FaClipboardList className="text-green-600" /> Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Users" value={stats.users} color="green" icon={<FaUsers />} />
        <StatCard title="Products" value={stats.products} color="blue" icon={<FaBoxOpen />} />
        <StatCard title="Categories" value={stats.categories} color="purple" icon={<FaTags />} />
        <StatCard title="Orders" value={stats.orders} color="yellow" icon={<FaShoppingCart />} />
        <StatCard title="Pending" value={stats.pending} color="red" icon={<FaHourglassHalf />} />
        <StatCard title="Completed" value={stats.completed} color="teal" icon={<FaCheckCircle />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all">
          <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <FaShoppingCart /> Recent Orders
          </h2>
          <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-100 text-green-700 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">User ID</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-green-50 transition">
                  <td className="p-2">{o.orderId}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        o.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-2">{o.farmer_id}</td>
                  <td className="p-2 font-semibold text-gray-700">
                    {o.totalPrice || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <p className="text-gray-500 text-sm mt-3">No orders found.</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all">
          <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <FaUser /> Recent Users
          </h2>
          <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-100 text-green-700 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-green-50 transition">
                  <td className="p-2">{u.userId}</td>
                  <td className="p-2 font-medium">{u.name}</td>
                  <td className="p-2 text-gray-600">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsers.length === 0 && (
            <p className="text-gray-500 text-sm mt-3">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-t-4 border-${color}-500 transition transform hover:-translate-y-1`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-4 rounded-full bg-${color}-100 text-${color}-600 text-2xl`}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-gray-500 font-medium">{title}</h2>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
