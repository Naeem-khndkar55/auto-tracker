import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
// ✅ Login
export const login = (data) => API.post('/users/login', data);

// ✅ Get All Vehicles
export const getAllVehicles = async () => API.get('/vehicles/getAll');

// ✅ Add Vehicle
export const addVehicle = async (data) => {
  const formData = new FormData();
  formData.append('ownerName', data.ownerName);
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('vehicleNumber', data.vehicleNumber);
  formData.append('permittedRoute', data.permittedRoute);
  formData.append('ownerImage', data.ownerImage);

  return API.post('/vehicles/add', formData);
};

// ✅ Get Vehicle by ID
export const getVehicleById = async (id) => API.get(`/vehicles/${id}`);

// ✅ Update Vehicle
export const updateVehicle = async (id, data) => {
  const formData = new FormData();
  formData.append('ownerName', data.ownerName);
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('vehicleNumber', data.vehicleNumber);
  formData.append('permittedRoute', data.permittedRoute);
  if (data.ownerImage) formData.append('ownerImage', data.ownerImage);

  return API.put(`/vehicles/${id}`, formData);
};

// ✅ Delete Vehicle
export const deleteVehicle = async (id) => API.delete(`/vehicles/${id}`);
