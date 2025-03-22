import { useState } from "react";
import { addVehicle } from "../services/api";
import { toast } from "react-toastify";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    phoneNumber: "",
    address: "",
    vehicleNumber: "",
    permittedRoute: "",
    ownerImage: null,
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, ownerImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ Start Loading
    try {
      await addVehicle(formData, token);
      toast.success("Vehicle added successfully 🚀");

      setFormData({
        ownerName: "",
        phoneNumber: "",
        address: "",
        vehicleNumber: "",
        permittedRoute: "",
        ownerImage: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add vehicle ❌");
    } finally {
      setLoading(false); // ✅ Stop Loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-lg rounded-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Vehicle</h2>

      {/* ✅ Input Fields */}
      <input
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        placeholder="Owner Name"
        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:border-blue-400 transition duration-200"
        required
      />
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:border-blue-400 transition duration-200"
        required
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:border-blue-400 transition duration-200"
        required
      />
      <input
        name="vehicleNumber"
        value={formData.vehicleNumber}
        onChange={handleChange}
        placeholder="Vehicle Number"
        className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:border-blue-400 transition duration-200"
        required
      />
      <input
        name="permittedRoute"
        value={formData.permittedRoute}
        onChange={handleChange}
        placeholder="Permitted Route"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:border-blue-400 transition duration-200"
        required
      />

      {/* ✅ File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:border-blue-400 transition duration-200"
        required
      />

      {/* ✅ Submit Button */}
      <button
        type="submit"
        disabled={loading} // ✅ Disable while loading
        className={`w-full p-3 rounded-md text-white transition-all duration-200 ${
          loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:scale-95"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
              ></path>
            </svg>
            Adding...
          </div>
        ) : (
          "Add Vehicle"
        )}
      </button>
    </form>
  );
};

export default AddVehicle;
