import { NavLink } from "react-router-dom";
// React Icons import කරන්නේ මෙහෙම
import { FaHome, FaUser, FaFolder, FaCog, FaBox } from "react-icons/fa";

export default function SideNav() {
  const sideNavItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUser />, path: "/admin/users" },
    { name: "Categories", icon: <FaFolder />, path: "/admin/categories" },
    { name: "Items", icon: <FaCog />, path: "/admin/items" },
    { name: "Orders", icon: <FaBox />, path: "/admin/orders" },
  ];

  return (
    <>
      <div className="w-full flex justify-center">
        <p className="text-green-600">FARMER SYSTEM</p>
      </div>

      <ul className="space-y-5 my-20">
        {sideNavItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded text-sm hover:bg-green-50 text-green-900 ${
                  isActive ? "bg-green-200" : ""
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}
