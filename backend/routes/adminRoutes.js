const express = require("express");
const { viewAllModerators, deleteModerator } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes (Admin only)
router.get("/moderators", authMiddleware, viewAllModerators);
router.delete("/moderators/:id", authMiddleware, deleteModerator);


const { getDashboardStats } = require("../controllers/adminController");


module.exports = router;


module.exports = router;