import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import VehicleList from "../components/VehicleList";
import AddVehicle from "../components/AddVehicle";
import VehiclesTable from "../components/VehiclesTable";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Section */}
      <div className="flex-1 p-4">
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
