import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

export default function AddOrderPopup({ product, onClose, refresh, setRefresh }) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setTotalPrice(quantity > 0 ? quantity * product.price : 0);
  }, [quantity, product.price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantity <= 0) {
      setError("Quantity must be at least 1");
      return;
    }

    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }

    const farmerId = product.farmer_id || product.user_Id || product.userId;
    if (!farmerId) {
      setError("Farmer ID not found. Cannot place order.");
      return;
    }

    const orderData = {
      orderDate: new Date().toISOString(),
      status: "Pending",
      farmer_id: farmerId,
      admin_id: user?.userId,
      totalPrice: totalPrice,
      items: [
        {
          productId: product.productId,
          quantity: quantity,
        },
      ],
    };

    console.log("Order data to send:", orderData);

    try {
      const response = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Order API response:", response.data);
      alert("Order placed successfully!"); // <-- Alert added here
      setError("");
      setRefresh(!refresh);
      onClose();
    } catch (err) {
      console.log("Order API error:", err.response);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-green-600 mb-4">Place Order</h2>
        <p className="mb-2 text-gray-700"><strong>Product:</strong> {product.productName}</p>
        <p className="mb-4 text-gray-700"><strong>Price per unit:</strong> LKR {product.price.toFixed(2)}</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="p-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <p className="text-gray-800 font-medium">Total Price: LKR {totalPrice.toFixed(2)}</p>
          <button type="submit" className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
            Place Order
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}
