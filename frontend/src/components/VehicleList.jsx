import React, { useState, useEffect } from "react";
import { getAllVehicles, deleteVehicle } from "../services/api";
import { toast } from "react-toastify";
import EditVehicle from "./EditVehicle";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch All Vehicles
  const fetchData = async () => {
    try {
      const response = await getAllVehicles();
      setVehicles(response.data.vehicles || []);
      setFilteredVehicles(response.data.vehicles || []);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  // ✅ Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = vehicles.filter((vehicle) =>
      vehicle.ownerName.toLowerCase().includes(term)
    );

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  };

  // ✅ Delete Vehicle
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (confirmDelete) {
      try {
        await deleteVehicle(id);
        toast.success("Vehicle deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };

  // ✅ Handle Vehicle Update (auto-refresh)
  const handleUpdateChange = async (updatedVehicle) => {
    try {
      toast.success("Vehicle updated successfully");
      await fetchData();
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to update vehicle");
    }
  };

  // ✅ Download QR Code
  const handleDownloadQR = (qrCode) => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = "vehicle-qr-code.png";
      link.click();
    } else {
      toast.error("No QR code available");
    }
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Vehicle List
      </h2>

      {/* ✅ Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by owner name..."
          className="w-full max-w-[400px] p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* ✅ Styled Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left font-semibold text-gray-700">
                S/N
              </th>
              <th className="border p-3 text-left font-semibold text-gray-700">
                Owner Name
              </th>
              <th className="border p-3 text-left font-semibold text-gray-700">
                Phone Number
              </th>
              <th className="border p-3 text-left font-semibold text-gray-700">
                Vehicle Number
              </th>
              <th className="border p-3 text-left font-semibold text-gray-700">
                Permitted Route
              </th>
              <th className="border p-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle, index) => (
                <tr key={vehicle._id} className="hover:bg-gray-50">
                  {/* ✅ Serial Number */}
                  <td className="border p-3 text-gray-800">
                    {startIndex + index + 1}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.ownerName}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.phoneNumber}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.vehicleNumber}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.permittedRoute}
                  </td>
                  <td className="border p-3 flex gap-2">
                    {/* ✅ Edit Button */}
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </button>
                    {/* ✅ Delete Button */}
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      Delete
                    </button>
                    {/* ✅ QR Code Button (Restored) */}
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                      onClick={() => handleDownloadQR(vehicle.qrCode)}
                    >
                      QR Code
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border p-3 text-center text-gray-500"
                >
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium px-2">
          {currentPage} / {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <EditVehicle
        isOpen={isEditOpen}
        vehicleData={selectedVehicle}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateChange}
      />
    </div>
  );
};

export default VehicleList;
