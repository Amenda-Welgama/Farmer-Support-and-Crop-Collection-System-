import { useAuth } from "../context/authContext"; // path එක adjust කරන්න
import { useNavigate } from "react-router-dom";

export default function TopNav() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };
  return (
    <>
      <div className="w-full flex justify-end">
        <div className="flex items-center gap-4 bg-green-200 px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm text-green-900">
            Hello{" "}
            <span className="font-semibold text-green-700">
              {user?.name || "User"}
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
