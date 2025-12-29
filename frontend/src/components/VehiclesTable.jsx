import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteVehicle,
  fetchVehicles,
  updateVehicleStatus,
} from "../services/api";
import Dialog from "./Dialog";
import EditVehicle from "./EditVehicle";

const VehiclesTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [inputPage, setInputPage] = useState(currentPage);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, vehicleId: null, vehicleName: "" });

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

  const handleDelete = async (id, vehicleName) => {
    setDeleteConfirm({ show: true, vehicleId: id, vehicleName: vehicleName || "this vehicle" });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.vehicleId) {
      try {
        await deleteVehicle(deleteConfirm.vehicleId);
        toast.success("Vehicle deleted successfully");
        refetch();
        setDeleteConfirm({ show: false, vehicleId: null, vehicleName: "" });
      } catch {
        toast.error("Failed to delete vehicle");
        setDeleteConfirm({ show: false, vehicleId: null, vehicleName: "" });
      }
    }
  };

  const handleStatusToggle = async (vehicle) => {
    const newStatus = vehicle.status === "active" ? "inactive" : "active";
    setUpdatingStatus(vehicle._id);

    try {
      await updateVehicleStatus(vehicle._id, newStatus);
      const statusText = newStatus === "active" ? "Active" : "Inactive";
      toast.success(`✅ Vehicle Status Changed to ${statusText}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: newStatus === "active" 
            ? "linear-gradient(to right, #10b981, #059669)"
            : "linear-gradient(to right, #6b7280, #4b5563)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "16px",
        },
      });
      refetch();
    } catch {
      toast.error("❌ Failed to Update Vehicle Status", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(to right, #ef4444, #dc2626)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "16px",
        },
      });
    } finally {
      setUpdatingStatus(null);
    }
  };
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditOpen(true);
  };
  const handleUpdateChange = async () => {
    try {
      toast.success("✅ Vehicle Updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(to right, #3b82f6, #2563eb)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "16px",
        },
      });
      refetch();
      setIsEditOpen(false);
    } catch {
      toast.error("❌ Failed to Update Vehicle", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(to right, #ef4444, #dc2626)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "16px",
        },
      });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Vehicle Management
          </h2>
          <p className="text-gray-600">Manage and monitor all vehicles</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by owner name, phone, vehicle number..."
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  {[
                    "S/N",
                    "Owner Name",
                    "Phone Number",
                    "Address",
                    "Vehicle Number",
                    "Permitted Route",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider ${
                        header === "Actions" ? "sticky right-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10 min-w-[360px]" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3">Loading vehicles...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-red-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Failed to fetch vehicles. Please try again.
                      </div>
                    </td>
                  </tr>
                ) : vehicles.length > 0 ? (
                  vehicles.map((vehicle, index) => (
                    <tr
                      key={vehicle._id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {vehicle.ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {vehicle.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {vehicle.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        <button
                          onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors duration-200"
                          title="Click to view details"
                        >
                          {vehicle.vehicleNumber}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {vehicle.permittedRoute}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleStatusToggle(vehicle)}
                            disabled={updatingStatus === vehicle._id}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg ${
                              vehicle.status === "active"
                                ? "bg-gradient-to-r from-green-500 to-green-600 focus:ring-green-500"
                                : "bg-gradient-to-r from-gray-300 to-gray-400 focus:ring-gray-400"
                            } ${updatingStatus === vehicle._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                            title={`Click to ${vehicle.status === "active" ? "deactivate" : "activate"} vehicle`}
                          >
                            {updatingStatus === vehicle._id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                                vehicle.status === "active"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } ${updatingStatus === vehicle._id ? "opacity-0" : "opacity-100"}`}
                            />
                          </button>
                          <div className="flex flex-col">
                            <span
                              className={`text-xs font-bold ${
                                vehicle.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {vehicle.status === "active" ? "Active" : "Inactive"}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {vehicle.status === "active" ? "✓ Enabled" : "✗ Disabled"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white z-10 min-w-[360px]">
                        <div className="flex flex-wrap gap-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                            className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                            title="View Vehicle Details"
                          >
                            <svg
                              className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">👁️</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                            title="Edit Vehicle Details"
                          >
                            <svg
                              className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">✏️</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(vehicle._id, vehicle.ownerName)}
                            className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                            title="Delete Vehicle"
                          >
                            <svg
                              className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">🗑️</span>
                          </button>

                          {/* QR Code Download Button */}
                          <button
                            onClick={() => {
                              if (vehicle.qrCode) {
                                handleDownloadQR(vehicle, index);
                                toast.success("QR Code downloaded successfully");
                              } else {
                                toast.warning("QR Code not available for this vehicle");
                              }
                            }}
                            className="group relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                            title="Download QR Code"
                          >
                            <svg
                              className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                            <span className="hidden sm:inline">QR Code</span>
                            <span className="sm:hidden">📱</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium">No vehicles found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {vehicles.length > 0 ? startIndex + 1 : 0} to{" "}
              {Math.min(startIndex + vehicles.length, data?.pagination?.total || 0)} of{" "}
              {data?.pagination?.total || 0} vehicles
            </div>

            <div className="flex items-center gap-3">
              {/* Go To Page Input */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Go to page:</span>
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
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm({ show: false, vehicleId: null, vehicleName: "" })}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Vehicle?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirm.vehicleName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, vehicleId: null, vehicleName: "" })}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesTable;
