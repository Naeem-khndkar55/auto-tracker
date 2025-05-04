Settings = require("../models/Settings");
require("dotenv").config();

const updateSettings = async (req, res) => {
  try {
    let { is_mantainance } = req.body;

    // Convert string to boolean

    const data = await Settings.findOneAndUpdate(
      { secret: req.params.secret },
      { is_mantainance },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        message: `Secret not found.`,
      });
    }

    res.status(200).json({
      message: "Update Successfully...",
      data,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      message: `${error.message}`,
    });
  }
};

const addSettings = async (req, res) => {
  try {
    const { is_mantainance, maintenance_message, secret } = req.body;
    const data = await Settings.create({
      secret,
      is_mantainance,
      maintenance_message,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      message: `${error.message}`,
    });
  }
};

const getSettings = async (req, res) => {
  const data = await Settings.find();
  return res.status(200).json(data);
};

const maintenanceCheck = async (req, res, next) => {
  try {
    // Find the settings document (you can also cache it for better performance)
    const settings = await Settings.findOne({});

    return res.status(200).json(settings);
  } catch (error) {
    console.error(`Maintenance Middleware Error: ${error.message}`);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

    // If not maintenance, continue

module.exports = {
  addSettings,
  updateSettings,
  getSettings,
  maintenanceCheck,
};
