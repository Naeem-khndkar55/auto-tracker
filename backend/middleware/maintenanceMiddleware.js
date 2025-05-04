const Settings = require("../models/Settings"); // adjust path as needed

const maintenanceMiddleware = async (req, res, next) => {
  try {
    // Find the settings document (you can also cache it for better performance)
    if (req.originalUrl.startsWith("/api/settings/update")) {
      return next();
    }
    if (req.originalUrl.startsWith("/api/settings/maintenance-status")) {
      return next();
    }
    const settings = await Settings.findOne({});

    if (settings && settings.is_mantainance) {
      // If maintenance mode is ON
      return res.status(503).json({
        message:
          "The system is currently under maintenance. Please try again later.",
      });
    }

    // If not maintenance, continue
    next();
  } catch (error) {
    console.error(`Maintenance Middleware Error: ${error.message}`);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = maintenanceMiddleware;
