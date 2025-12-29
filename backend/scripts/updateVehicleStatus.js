// Try loading .env from multiple possible locations
const path = require("path");
const fs = require("fs");

const envPaths = [
  path.join(__dirname, "../.env"),
  path.join(__dirname, "../../.env"),
  path.join(process.cwd(), ".env"),
  path.join(process.cwd(), "../.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
    console.log(`Loaded .env from: ${envPath}`);
    break;
  }
}

// If still not loaded, try default dotenv
if (!process.env.MONGO_URI) {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

const updateVehicleStatus = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      console.log("Please ensure .env file exists with MONGO_URI");
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");

    // Update all vehicles that don't have a status field or have null/undefined status
    const result = await Vehicle.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }] },
      { $set: { status: "active" } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} vehicles`);
    console.log(`📊 Matched ${result.matchedCount} vehicles`);
    console.log(`✅ All existing vehicles now have status: 'active'`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error updating vehicles status: ${error.message}`);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

updateVehicleStatus();

