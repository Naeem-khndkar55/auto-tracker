const express = require("express");
const router = express.Router();
const {
  createModerator,
  getModerators,
  deleteModerator,
} = require("../controllers/moderatorController");

router.post("/", createModerator); // ✅ Add moderator
router.get("/", getModerators); // ✅ Get all moderators
router.delete("/:id", deleteModerator); // ✅ Delete moderator

module.exports = router;
