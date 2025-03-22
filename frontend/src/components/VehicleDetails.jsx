import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getVehicleById } from "../services/api";
const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await getVehicleById(id);
        setVehicle(response.data);
      } catch (error) {
        toast.error("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };
    console.log("heello");
    fetchVehicle();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="text-center text-red-500 mt-10">Vehicle not found!</div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Owner Name:</strong> {vehicle.ownerName}
        </p>
        <p>
          <strong>Phone Number:</strong> {vehicle.phoneNumber}
        </p>
        <p>
          <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}
        </p>
        <p>
          <strong>Permitted Route:</strong> {vehicle.permittedRoute}
        </p>
      </div>

      {/* Owner Image */}
      {vehicle.ownerImage && (
        <img
          src={vehicle.ownerImage}
          alt="Owner"
          className="mt-4 w-full h-48 object-cover rounded-md"
        />
      )}

      {/* QR Code Preview */}
      {vehicle.qrCode && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">QR Code:</h3>
          <img
            src={vehicle.qrCode}
            alt="QR Code"
            className="w-32 h-32 mx-auto border"
          />
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
