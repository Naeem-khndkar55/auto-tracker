import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicles, deleteVehicle } from "../services/api";
import { toast } from "react-toastify";
import Dialog from "./Dialog";
import EditVehicle from "./EditVehicle";
import { use } from "react";

const VehiclesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [inputPage, setInputPage] = useState(currentPage);
  const openDialog = () => setShowDialog(true);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vehicles", { page: currentPage, limit, search: searchTerm }],
    queryFn: fetchVehicles,
    keepPreviousData: true,
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.pagination?.totalPages) {
      setCurrentPage(page);
    }
  };

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
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };
  const handleUpdateChange = async (updatedVehicle) => {
    try {
      toast.success("Vehicle updated successfully");
      await fetchData();
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to update vehicle");
    }
  };

  const handleDownloadQR = (vehicle, index) => {
    const qrCode = vehicle.qrCode;

    // Create a link element
    const link = document.createElement("a");
    // Set href to the base64 data
    link.href = `${qrCode}`;
    link.download = `${startIndex + index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const vehicles = data?.vehicles || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const startIndex = (currentPage - 1) * limit;

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Vehicle List
      </h2>
      {/* ✅ Search Input */}
      {/* ✅ Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by owner name..."
          className="w-full max-w-[400px] p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              {[
                "S/N",
                "Owner Name",
                "Phone Number",
                "Address",
                "Vehicle Number",
                "Permitted Route",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="border p-3 text-left font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center p-3">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="7" className="text-center p-3 text-red-500">
                  Failed to fetch vehicles.
                </td>
              </tr>
            ) : vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <tr key={vehicle._id} className="hover:bg-gray-50">
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
                    {vehicle.address}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.vehicleNumber}
                  </td>
                  <td className="border p-3 text-gray-800">
                    {vehicle.permittedRoute}
                  </td>
                  <td className="border p-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                      onClick={() => handleDownloadQR(vehicle, index)}
                    >
                      QR Code
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-3 text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="mt-4 pb-4 flex justify-end items-center gap-2">
        {/* Go To Page Input */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt(inputPage);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {/* <span className="text-gray-700 font-medium px-2">
          {currentPage} / {totalPages}
        </span> */}
        {/* Page Count */}
        <span className="text-gray-800 font-medium">
          Page {currentPage} of {totalPages}
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
      {/* ✅ Dialog for QR Code */}
      {/* Overlay */}
      <Dialog
        showDialog={showDialog}
        closeDialog={() => setShowDialog(false)}
        vichicle={selectedVehicle}
      />
    </div>
  );
};

export default VehiclesTable;
