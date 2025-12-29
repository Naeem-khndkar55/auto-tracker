import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getVehicleDetails } from "../services/api";
import {
  FaUser,
  FaPhone,
  FaCar,
  FaRoute,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaQrcode,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await getVehicleDetails(id);
        // Handle response data structure
        setVehicle(response.data?.data || response.data);
      } catch (error) {
        toast.error("Failed to load vehicle details");
        console.error("Error fetching vehicle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleDownloadQR = () => {
    if (vehicle?.qrCode) {
      const link = document.createElement("a");
      link.href = vehicle.qrCode;
      link.download = `${vehicle.vehicleNumber || "vehicle"}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code downloaded successfully");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600">The vehicle you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-base font-semibold text-gray-900 break-words">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vehicle Information</h1>
              <p className="text-blue-100">Complete vehicle details and documentation</p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  vehicle.status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {vehicle.status === "active" ? (
                  <>
                    <FaCheckCircle />
                    Active
                  </>
                ) : (
                  <>
                    <FaTimesCircle />
                    Inactive
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Owner Image Section */}
            {vehicle.ownerImage && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaUser />
                    Owner Photo
                  </h2>
                </div>
                <div className="p-6">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={vehicle.ownerImage}
                      alt="Owner"
                      className="w-full h-96 object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Information Grid */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaCar />
                  Vehicle Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={FaUser}
                    label="Owner Name"
                    value={vehicle.ownerName}
                  />
                  <InfoCard
                    icon={FaPhone}
                    label="Phone Number"
                    value={vehicle.phoneNumber}
                  />
                  <InfoCard
                    icon={FaCar}
                    label="Vehicle Number"
                    value={vehicle.vehicleNumber}
                    className="md:col-span-2"
                  />
                  <InfoCard
                    icon={FaMapMarkerAlt}
                    label="Address"
                    value={vehicle.address}
                    className="md:col-span-2"
                  />
                  <InfoCard
                    icon={FaRoute}
                    label="Permitted Route"
                    value={vehicle.permittedRoute}
                    className="md:col-span-2"
                  />
                  {vehicle.vehicle_type && (
                    <InfoCard
                      icon={FaTag}
                      label="Vehicle Type"
                      value={vehicle.vehicle_type}
                    />
                  )}
                  {vehicle.organization && (
                    <InfoCard
                      icon={FaBuilding}
                      label="Organization"
                      value={vehicle.organization}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-6">
            {vehicle.qrCode && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaQrcode />
                    QR Code
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                      <img
                        src={vehicle.qrCode}
                        alt="QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <button
                      onClick={handleDownloadQR}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <FaDownload />
                      Download QR Code
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Scan this QR code to view vehicle details
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {vehicle.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Vehicle ID</span>
                  <span className="text-sm font-mono text-gray-800">
                    {vehicle._id?.slice(-8) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
