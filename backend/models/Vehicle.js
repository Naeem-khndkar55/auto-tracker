const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  ownerImage: { type: String },
  vehicleNumber: { type: String, required: true, unique: true },
  permittedRoute: { type: String, required: true },
  qrCode: { type: String }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
