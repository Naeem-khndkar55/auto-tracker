import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaCar,
  FaPlusCircle,
  FaSignOutAlt,
  FaHome,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "View Vehicles",
      icon: FaHome,
      path: "/dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      id: "add",
      label: "Add Vehicle",
      icon: FaPlusCircle,
      path: "/dashboard/add",
      onClick: () => navigate("/dashboard/add"),
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <FaCar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  Vehicle Info
                </h2>
                <p className="text-xs text-gray-400">Cumilla</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-700">
            <button
          onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-center text-gray-500">
              © 2025 Vehicle Info
            </p>
            <p className="text-xs text-center text-gray-600 mt-1">
              All rights reserved
            </p>
          </div>
        </div>
    </div>
    </>
  );
};

export default Sidebar;
