import { useState } from "react";
import { FaBoxOpen, FaEdit } from "react-icons/fa";
import ItemCard from "../../features/item/itemCard"; 
import EditItemCard from "../../features/item/editItemCard"; 
// import ItemForm from "../../features/item/itemForm";

function Items() {
  const [activeTab, setActiveTab] = useState("Show Item");
  const [refresh, setRefresh] = useState(false);

  const tabs = [
    { name: "Show Item", icon: <FaBoxOpen /> },
    { name: "Manage Item", icon: <FaEdit /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <h1 className="text-xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <FaBoxOpen className="text-green-600" /> Browse Item
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
        {activeTab === "Show Item" && (
          <Card title="Show Item" icon={<FaBoxOpen />}>
            <p className="text-gray-700 mb-4">
              List of items and their details shown here.
            </p>
            <ItemCard refresh={refresh} />
          </Card>
        )}

        {activeTab === "Manage Item" && (
          <Card title="Manage Item" icon={<FaEdit />}>
            <p className="text-gray-700 mb-4">
              This is where you can manage item entries.
            </p>
            {/* <ItemForm refresh={refresh} setRefresh={setRefresh}/> */}
            <EditItemCard refresh={refresh} setRefresh={setRefresh} />
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

export default Items;
