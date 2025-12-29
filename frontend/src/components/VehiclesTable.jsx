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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

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
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input with Enhanced UI */}
            <div className="flex-1 w-full md:max-w-2xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Vehicles
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by owner name, phone number, vehicle number, address..."
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    title="Clear search"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Searching for: <span className="font-semibold text-blue-600">{searchTerm}</span>
                </p>
              )}
            </div>

            {/* Search Stats */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">{data?.pagination?.total || 0}</div>
                <div className="text-xs opacity-90">Total Vehicles</div>
              </div>
              {searchTerm && (
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md text-sm">
                  <span className="font-semibold">{vehicles.length}</span> found
                </div>
              )}
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
                    "",
                  ].map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider ${
                        header === "" ? "sticky right-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10" : ""
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
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-150 border-b border-gray-100"
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
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white z-10">
                        <div className="flex items-center justify-end menu-container relative z-30">
                          {/* 3-Dot Menu Button */}
                          <div className="relative z-40">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const button = e.currentTarget;
                                const rect = button.getBoundingClientRect();
                                if (openMenuId === vehicle._id) {
                                  setOpenMenuId(null);
                                  setSelectedVehicle(null);
                                } else {
                                  setMenuPosition({
                                    top: rect.bottom + 8,
                                    right: window.innerWidth - rect.right,
                                  });
                                  setSelectedVehicle(vehicle);
                                  setOpenMenuId(vehicle._id);
                                }
                              }}
                              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                openMenuId === vehicle._id
                                  ? "bg-blue-100 text-blue-600"
                                  : "hover:bg-gray-100 text-gray-600"
                              }`}
                              title="Actions Menu"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>
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

        {/* Dropdown Menu - Fixed Position Portal */}
        {openMenuId && selectedVehicle && (
          <>
            {/* Backdrop overlay - closes menu on outside click */}
            <div 
              className="fixed inset-0 z-[9998]" 
              onClick={() => {
                // Close menu when clicking outside
                setOpenMenuId(null);
                setSelectedVehicle(null);
              }}
            />
            {/* Menu positioned fixed - stops propagation to prevent backdrop from closing */}
            <div 
              className="fixed w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden min-w-[224px]"
              style={{
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`,
              }}
              onClick={(e) => {
                // Prevent backdrop from receiving click
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                // Also stop on mousedown to prevent any issues
                e.stopPropagation();
              }}
            >
              {/* Menu Header */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</p>
              </div>
              
              <div className="py-1">
                {/* View */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vehicles/${selectedVehicle._id}`);
                    setOpenMenuId(null);
                    setSelectedVehicle(null);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-all duration-150 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                    <svg
                      className="w-4 h-4 text-purple-600"
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
                  </div>
                  <span>View Details</span>
                </button>

                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(selectedVehicle);
                    setOpenMenuId(null);
                    setSelectedVehicle(null);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-all duration-150 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  </div>
                  <span>Edit Vehicle</span>
                </button>

                {/* QR Code */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const vehicleIndex = vehicles.findIndex(v => v._id === selectedVehicle._id);
                    if (selectedVehicle.qrCode) {
                      handleDownloadQR(selectedVehicle, vehicleIndex);
                      toast.success("QR Code downloaded successfully");
                    } else {
                      toast.warning("QR Code not available for this vehicle");
                    }
                    setOpenMenuId(null);
                    setSelectedVehicle(null);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-3 transition-all duration-150 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  </div>
                  <span>Download QR Code</span>
                </button>

                {/* Divider */}
                <div className="my-1 border-t border-gray-200"></div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(selectedVehicle._id, selectedVehicle.ownerName);
                    setOpenMenuId(null);
                    setSelectedVehicle(null);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-all duration-150 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-colors">
                    <svg
                      className="w-4 h-4 text-red-600"
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
                  </div>
                  <span>Delete Vehicle</span>
                </button>
              </div>
            </div>
          </>
        )}

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
