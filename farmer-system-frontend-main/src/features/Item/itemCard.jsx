import axios from "axios";
import React, { useEffect, useState } from "react";
import AddOrderPopup from "../order/addOrderPopup";

const ItemCard = ({ refresh, setRefresh }) => {
  const [productData, setProductData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("Product data fetched successfully:", res.data);
          setProductData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [refresh]);

  // Order button handler
  const handleOrderNow = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4">
      {productData.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No products found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productData.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                {/* Product Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {product.productName}
                  </h2>
                  {product.available ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">ID:</span> {product.productId}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> LKR
                    {product.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Stock Qty:</span>{" "}
                    {product.stockQuantity}
                  </p>
                  <p>
                    <span className="font-medium">User:</span>
                    <span className="text-green-700 font-bold">
                      {product.user ? product.user.name : "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>
                    <span className="text-green-700 font-bold">
                      {product.category
                        ? product.category.categoryName
                        : "Unknown"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOrderNow(product)}
                className="mt-4 w-full bg-green-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-700 transition"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}
      {isPopupOpen && selectedProduct && (
        <AddOrderPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default ItemCard;
