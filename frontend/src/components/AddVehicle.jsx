import { useState } from "react";
import { addVehicle } from "../services/api";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCar,
  FaRoute,
  FaBuilding,
  FaTag,
  FaImage,
  FaPlusCircle,
} from "react-icons/fa";

const organizations = ["মিশুক মালিক", "ইজি বাইক মালিক"];
const types = ["৩ সিট মিশুক", "৭ সিট ইজি বাইক"];

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    phoneNumber: "",
    address: "",
    vehicleNumber: "",
    permittedRoute: "",
    ownerImage: null,
    vehicle_type: "",
    organization: "",
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
      toast.success("✅ Vehicle Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          background: "linear-gradient(to right, #10b981, #059669)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "16px",
        },
      });

      setFormData({
        ownerName: "",
        phoneNumber: "",
        address: "",
        vehicleNumber: "",
        permittedRoute: "",
        ownerImage: null,
        vehicle_type: "",
        organization: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to Add Vehicle", {
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
      setLoading(false); // ✅ Stop Loading
    }
  };

  const InputField = ({ icon: Icon, name, value, onChange, placeholder, type = "text", required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <Icon className="inline w-4 h-4 mr-2 text-blue-600" />
        {placeholder}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
        required={required}
      />
    </div>
  );

  const SelectField = ({ icon: Icon, name, value, onChange, placeholder, options, required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <Icon className="inline w-4 h-4 mr-2 text-blue-600" />
        {placeholder}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
        required={required}
      >
        <option value="">Select {placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaPlusCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Add New Vehicle</h1>
              <p className="text-blue-100">Register a new vehicle in the system</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Name */}
            <InputField
              icon={FaUser}
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner Name"
            />

            {/* Phone Number */}
            <InputField
              icon={FaPhone}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              type="tel"
            />

            {/* Address - Full Width */}
            <div className="md:col-span-2">
              <InputField
                icon={FaMapMarkerAlt}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>

            {/* Vehicle Number */}
            <InputField
              icon={FaCar}
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
            />

            {/* Permitted Route */}
            <InputField
              icon={FaRoute}
              name="permittedRoute"
              value={formData.permittedRoute}
              onChange={handleChange}
              placeholder="Permitted Route"
            />

            {/* Organization */}
            <SelectField
              icon={FaBuilding}
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Organization"
              options={organizations}
            />

            {/* Vehicle Type */}
            <SelectField
              icon={FaTag}
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              placeholder="Vehicle Type"
              options={types}
            />

            {/* File Upload - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaImage className="inline w-4 h-4 mr-2 text-blue-600" />
                Owner Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  required
                />
              </div>
              {formData.ownerImage && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                  <FaImage className="w-4 h-4" />
                  {formData.ownerImage.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
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
                  Adding Vehicle...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaPlusCircle />
                  Add Vehicle
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
