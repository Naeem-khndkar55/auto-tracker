const Vehicle = require("../models/Vehicle");
const QRCode = require("qrcode");
const cloudinary = require("../utils/cloudinary");
const ExcelJS = require("exceljs");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL; // ✅ Use machine IP
const CLIENT_URL = process.env.CLIENT_URL; // ✅ Use machine IP
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
    const qrData = `${CLIENT_URL}/api/vehicles/${vehicle._id}`;
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

    // ✅ Check if vehicle status is inactive
    if (vehicle.status === "inactive") {
      // ✅ Read the blocked vehicle template
      const blockedTemplatePath = path.join(
        __dirname,
        "../templates/vehicle-blocked.html"
      );
      let blockedHtml = fs.readFileSync(blockedTemplatePath, "utf8");

      // ✅ Replace placeholders with actual data
      blockedHtml = blockedHtml
        .replace("{{vehicleNumber}}", vehicle.vehicleNumber || "N/A")
        .replace("{{ownerName}}", vehicle.ownerName || "N/A");

      // ✅ Send the blocked HTML response
      res.setHeader("Content-Type", "text/html");
      return res.send(blockedHtml);
    }

    // ✅ Read the HTML template for active vehicles
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

// ✅ Get Vehicle Details (JSON API)
const getVehicleDetails = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Return vehicle data as JSON
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error(`Error fetching vehicle details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch vehicle details",
    });
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

const updateExistingVehiclesStatus = async (req, res) => {
  try {
    // Update all vehicles that don't have a status field or have null/undefined status
    const result = await Vehicle.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }] },
      { $set: { status: "active" } }
    );

    res.status(200).json({
      message: "Existing vehicles status updated successfully",
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error) {
    console.error(`❌ Error updating vehicles status: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    // Get headers from first row
    const headers = [];
    worksheet.getRow(1).eachCell((cell) => {
      headers.push(cell.value);
    });

    // Convert rows to JSON
    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (header) {
          rowData[header] = cell.value;
        }
      });
      data.push(rowData);
    });

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
        
        const qrData = `${CLIENT_URL}/api/vehicles/${vehicle._id}`;
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        vehicle.qrCode = qrCodeUrl;
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

// ✅ Update Vehicle Status (active/inactive)
const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      message: `Vehicle status updated to ${status} successfully`,
      vehicle,
    });
  } catch (error) {
    console.error(`❌ Error updating vehicle status: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update All Vehicles Status (bulk update)
const updateAllVehiclesStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    // Update all vehicles with the new status
    const result = await Vehicle.updateMany(
      {}, // Empty filter means update all documents
      { $set: { status } }
    );

    res.status(200).json({
      success: true,
      message: `All vehicles status updated to ${status} successfully`,
      updatedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      totalVehicles: result.matchedCount,
    });
  } catch (error) {
    console.error(`❌ Error updating all vehicles status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleDetails,
  updateVehicle,
  deleteVehicle,
  uploadExcel,
  updateExistingVehiclesStatus,
  updateVehicleStatus,
  updateAllVehiclesStatus,
};
