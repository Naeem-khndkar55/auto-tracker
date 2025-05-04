const express = require("express");
const {
  addSettings,
  updateSettings,
  getSettings,
  maintenanceCheck,
} = require("../controllers/settingsController");

const router = express.Router();
router.get("/", getSettings);
router.get("/maintenance-status", maintenanceCheck);
router.post("/create", addSettings);
router.put("/update/:secret", updateSettings);

module.exports = router;
