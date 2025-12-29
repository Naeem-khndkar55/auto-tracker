import { Outlet, Route, Routes } from "react-router-dom";
import AddVehicle from "../components/AddVehicle";
import Sidebar from "../components/Sidebar";
import VehiclesTable from "../components/VehiclesTable";

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto lg:p-4 p-2 pt-16 lg:pt-4">
        <Routes>
          <Route index element={<VehiclesTable />} />{" "}
          {/* ✅ Inherit parent path */}
          <Route path="add" element={<AddVehicle />} />{" "}
          {/* ✅ Correct nested route */}
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
