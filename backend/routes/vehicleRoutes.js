const express = require("express");
const {
  addVehicle,
  getAllVehicles,
  deleteVehicle,
  getVehicleById,
  getVehicleDetails,
  updateVehicle,
  uploadExcel,
  updateExistingVehiclesStatus,
  updateVehicleStatus,
  updateAllVehiclesStatus,
} = require("../controllers/vehicleController");
const upload = require("../utils/multer");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/getAll", protect, getAllVehicles);
router.get("/:id/details", getVehicleDetails);
router.get("/:id", getVehicleById);
router.put("/:id", protect, upload.single("ownerImage"), updateVehicle);
router.patch("/status/all", protect, updateAllVehiclesStatus);
router.patch("/:id/status", protect, updateVehicleStatus);
router.post("/add", protect, upload.single("ownerImage"), addVehicle);
router.post("/upload/excel", upload.single("file"), uploadExcel);
router.post("/update-status", protect, updateExistingVehiclesStatus);

router.delete("/:id", protect, deleteVehicle);

module.exports = router;
