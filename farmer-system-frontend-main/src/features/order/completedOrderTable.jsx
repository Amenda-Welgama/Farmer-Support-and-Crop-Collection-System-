import React, { useEffect, useState } from "react";
import axios from "axios";


export default function CopmletedOrderTable({ refresh }) {

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/completed", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.log("Error fetching orders:", err.response);
        setError(err.response?.data?.message || "Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [token, refresh]);

  return (
    <div className="overflow-x-auto p-4">
      <div className="inline-block h-80 overflow-y-scroll min-w-full rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Farmer ID</th>
              <th className="px-6 py-3 text-left">Admin ID</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Updated At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{order.orderId}</td>
                  <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">LKR{order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">{order.status}</td>
                  <td className="px-6 py-4">{order.farmer_id}</td>
                  <td className="px-6 py-4">{order.admin_id}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(order.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
