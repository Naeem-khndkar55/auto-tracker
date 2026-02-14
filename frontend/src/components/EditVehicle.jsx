import { useState, useEffect } from "react";
import { updateVehicle } from "../services/api";
import { toast } from "react-toastify";

const EditVehicle = ({ isOpen, vehicleData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    phoneNumber: "",
    address: "",
    vehicleNumber: "",
    permittedRoute: "",
    ownerImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when vehicleData changes
  useEffect(() => {
    if (vehicleData) {
      setFormData({
        ownerName: vehicleData.ownerName || "",
        phoneNumber: vehicleData.phoneNumber || "",
        address: vehicleData.address || "",
        vehicleNumber: vehicleData.vehicleNumber || "",
        permittedRoute: vehicleData.permittedRoute || "",
        ownerImage: null,
      });
      setPreviewImage(vehicleData.ownerImage || null);
    }
  }, [vehicleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, ownerImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = vehicleData?._id ?? vehicleData?.id;
    if (!id) {
      toast.error("Vehicle data missing. Please close and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await updateVehicle(id, formData);
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

      // ✅ Trigger state update in parent (pass API response vehicle)
      onUpdate(data);
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update vehicle";
      toast.error(`❌ ${message}`, {
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
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        {/* ✅ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-400 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Vehicle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ Owner Name */}
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Owner Name"
            required
          />

          {/* ✅ Phone Number */}
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            required
          />

          {/* ✅ Vehicle Number */}
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Vehicle Number"
            required
          />

          {/* ✅ Permitted Route */}
          <input
            type="text"
            name="permittedRoute"
            value={formData.permittedRoute}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Permitted Route"
            required
          />

          {/* ✅ Owner Image */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">
              Owner Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
            {previewImage && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-64 object-contain"
                />
              </div>
            )}
          </div>

          {/* ✅ Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating…" : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
