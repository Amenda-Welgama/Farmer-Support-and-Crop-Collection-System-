import { useState } from "react";
import { FaClipboardList, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import AllOrderTable from "../../features/order/allOrderTable";
import PendingOrderTable from "../../features/order/pendingOrderTable";
import CompletedOrderTable from "../../features/order/completedOrderTable";

function Orders() {
  const [activeTab, setActiveTab] = useState("All Orders");

  const tabs = [
    { name: "All Orders", icon: <FaClipboardList /> },
    { name: "Pending Orders", icon: <FaHourglassHalf /> },
    { name: "Completed Orders", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <FaClipboardList className="text-green-600" /> Orders
      </h1>

      {/* Tabs */}
      <div className="w-full overflow-x-auto mb-6">
        <ul className="flex border-b-2 border-gray-300 gap-6 px-2 sm:px-6">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-1 text-sm cursor-pointer pb-1 ${
                activeTab === tab.name
                  ? "text-black border-b-2 border-green-500 font-semibold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "All Orders" && (
          <Card title="All Orders" icon={<FaClipboardList />}>
            <p className="text-gray-700 mb-4">List of all orders.</p>
            <AllOrderTable />
          </Card>
        )}

        {activeTab === "Pending Orders" && (
          <Card title="Pending Orders" icon={<FaHourglassHalf />}>
            <p className="text-gray-700 mb-4">List of pending orders.</p>
            <PendingOrderTable />
          </Card>
        )}

        {activeTab === "Completed Orders" && (
          <Card title="Completed Orders" icon={<FaCheckCircle />}>
            <p className="text-gray-700 mb-4">List of completed orders.</p>
            <CompletedOrderTable />
          </Card>
        )}
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({ title, icon, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all">
      <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

export default Orders;
