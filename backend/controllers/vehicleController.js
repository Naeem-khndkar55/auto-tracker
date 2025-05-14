const Vehicle = require("../models/Vehicle");
const QRCode = require("qrcode");
const cloudinary = require("../utils/cloudinary");
const XLSX = require("xlsx");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL; // ✅ Use machine IP
const fs = require("fs");
const path = require("path");
const BATCH_SIZE = 1000;
// ✅ Add Vehicle
const addVehicle = async (req, res) => {
  const {
    ownerName,
    phoneNumber,
    address,
    vehicleNumber,
    permittedRoute,
    vehicle_type,
    organization,
  } = req.body;

  try {
    let ownerImage = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      ownerImage = result.secure_url;
    }

    // ✅ Save Vehicle
    const vehicle = new Vehicle({
      ownerName,
      phoneNumber,
      address,
      vehicleNumber,
      permittedRoute,
      ownerImage,
      vehicle_type,
      organization,
    });

    await vehicle.save();

    // ✅ Generate QR Code with API URL
    const qrData = `${BASE_URL}/api/vehicles/${vehicle._id}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    vehicle.qrCode = qrCodeUrl;
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Vehicles
const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { ownerName: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { vehicleNumber: { $regex: search, $options: "i" } },
            { permittedRoute: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { vehicle_type: { $regex: search, $options: "i" } },
            { organization: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalVehicles = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      vehicles,
      pagination: {
        total: totalVehicles,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalVehicles / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).send("<h2>Vehicle not found</h2>");
    }

    // ✅ Read the HTML template
    const templatePath = path.join(__dirname, "../templates/vehicle.html");
    let html = fs.readFileSync(templatePath, "utf8");

    // ✅ Replace placeholders with actual data
    html = html
      .replace("{{vehicleNumber}}", vehicle.vehicleNumber)
      .replace("{{ownerName}}", vehicle.ownerName)
      .replace("{{phoneNumber}}", vehicle.phoneNumber)
      .replace("{{address}}", vehicle.address)
      .replace("{{permittedRoute}}", vehicle.permittedRoute)
      .replace("{{ownerImage}}", vehicle.ownerImage || "")
      .replace("{{qrCode}}", vehicle.qrCode || "");

    // ✅ Send the HTML response
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send(`<h2>Error: ${error.message}</h2>`);
  }
};

// ✅ Update Vehicle
const updateVehicle = async (req, res) => {
  const { ownerName, phoneNumber, address, vehicleNumber, permittedRoute } =
    req.body;

  try {
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id },
      { ownerName, phoneNumber, address, vehicleNumber, permittedRoute },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // ✅ Regenerate QR Code with updated details
    const qrData = `${BASE_URL}/api/vehicles/${updatedVehicle._id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    updatedVehicle.qrCode = qrCode;

    await updatedVehicle.save();

    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error(`❌ Error updating vehicle: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // ✅ Delete Owner Image from Cloudinary (if exists)
    if (vehicle.ownerImage) {
      // ✅ Extract public ID from URL
      const publicId = vehicle.ownerImage.split("/").pop().split(".")[0]; // Extract last part of URL and remove file extension

      console.log(`Deleting image with public ID: ${publicId}`);

      // ✅ Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }

    // ✅ Delete QR Code from Cloudinary (if exists)
    if (vehicle.qrCode) {
      const qrPublicId = vehicle.qrCode.split("/").pop().split(".")[0];

      console.log(`Deleting QR code with public ID: ${qrPublicId}`);

      await cloudinary.uploader.destroy(qrPublicId);
    }

    // ✅ Finally delete vehicle from DB
    await Vehicle.findByIdAndDelete(id);

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error(`Error deleting vehicle: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const updatedVehicleByOriginized = async (req, res) => {
  try {
    const vichles = await Vehicle.find();

    for (let vehicle of vichles) {
      vehicle.organization = "ইজি বাইক মালিক";
      vehicle.vehicle_type = "৭ সিট ইজি বাইক";
      await vehicle.save();
    }
    res.status(200).json({ message: "Vehicles updated successfully" });
  } catch (error) {
    console.error(`❌ Error updating vehicle: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Total rows: ${data.length}`);

    //Insert in batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      //await Vehicle.insertMany(batch);
      for (let vehicleData of batch) {
        const vehicle = new Vehicle({
          ownerName: vehicleData.ownerName,
          phoneNumber: vehicleData.phoneNumber,
          address: vehicleData.address,
          vehicleNumber: vehicleData.vehicleNumber,
          permittedRoute: vehicleData.permittedRoute,
          organization: vehicleData.organization,
          vehicle_type: vehicleData.vehicle_type,
        });
        await vehicle.save();
      }
      console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
    }

    res.status(200).json({
      message: "Excel data inserted in batches successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing Excel file" });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadExcel,
};
