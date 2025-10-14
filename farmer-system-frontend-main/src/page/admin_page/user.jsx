import { useState } from "react";
import { FaUsers, FaUserEdit } from "react-icons/fa"; // Better icons
import UserTable from "../../features/user/userTable";
import UsersForm from "../../features/user/usersForm";
import EditUserTable from "../../features/user/editUserTable";

function UserForm() {
  const [activeTab, setActiveTab] = useState("Show User");
  const [refresh, setRefresh] = useState(false);

  const tabs = [
    { name: "Show User", icon: <FaUsers /> },
    { name: "Manage User", icon: <FaUserEdit /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <FaUsers className="text-green-600" /> User Management
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
        {activeTab === "Show User" && (
          <Card title="Show Users" icon={<FaUsers />}>
            <p className="text-gray-700 mb-4">
              List of users and their details shown here.
            </p>
            <UserTable refresh={refresh} />
          </Card>
        )}

        {activeTab === "Manage User" && (
          <Card title="Manage Users" icon={<FaUserEdit />}>
            <p className="text-gray-700 mb-4">
              This is where you can manage user accounts.
            </p>
            <UsersForm refresh={refresh} setRefresh={setRefresh} />
            <EditUserTable refresh={refresh} setRefresh={setRefresh} />
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

export default UserForm;
