import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Vehicle Management</h2>
      <ul>
        <li
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer p-2 hover:bg-gray-700 rounded-md"
        >
          View Vehicles
        </li>
        <li
          onClick={() => navigate("/dashboard/add")}
          className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-2"
        >
          Add Vehicle
        </li>
        <li
          onClick={handleLogout}
          className="cursor-pointer p-2 hover:bg-gray-700 rounded-md mt-4"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
