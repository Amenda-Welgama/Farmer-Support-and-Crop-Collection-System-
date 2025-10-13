import axios from "axios";
import React, { useEffect, useState } from "react";
import UpdateUserForm from "../user/updateUserForm";

const EditUserTable = ({ refresh, setRefresh }) => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res) {
          setUserData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("User deleted successfully.");
          fetchUsers();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user); // open modal
  };

  return (
    <div className="overflow-x-auto p-4 py-5">
      <div className="inline-block h-80 overflow-y-scroll min-w-full rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full  bg-white text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-green-200 via-green-100 to-green-200 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              userData.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.userId}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4 capitalize">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 Modal Component */}
      {selectedUser && (
        <UpdateUserForm
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default EditUserTable;
