const express = require("express");
const {
  addVehicle,
  getAllVehicles,
  deleteVehicle,
  getVehicleById,
  updateVehicle,
  uploadExcel,
} = require("../controllers/vehicleController");
const upload = require("../utils/multer");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/getAll", protect, getAllVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", protect, upload.single("ownerImage"), updateVehicle);
router.post("/add", protect, upload.single("ownerImage"), addVehicle);
router.post("/upload/excel", upload.single("file"), uploadExcel);

router.delete("/:id", protect, deleteVehicle);

module.exports = router;
