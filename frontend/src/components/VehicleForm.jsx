import { useState } from "react";
import { addVehicle } from "../services/api";
import { toast } from "react-toastify";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    phoneNumber: "",
    vehicleNumber: "",
    permittedRoute: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(formData, token);
      toast.success("Vehicle added successfully");
    } catch (error) {
      toast.error("Failed to add vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="ownerName"
        placeholder="Owner Name"
        onChange={handleChange}
        required
      />
      <input
        name="vehicleNumber"
        placeholder="Vehicle Number"
        onChange={handleChange}
        required
      />
      <button type="submit">Add Vehicle</button>
    </form>
  );
};

export default VehicleForm;
