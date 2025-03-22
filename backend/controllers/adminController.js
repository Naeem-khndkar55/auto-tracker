const User = require("../models/User");

// ✅ View all moderators
exports.viewAllModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" }).select("-password");
    
    if (!moderators || moderators.length === 0) {
      return res.status(404).json({ message: "No moderators found" });
    }

    res.status(200).json({ moderators });
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ error: "Failed to fetch moderators" });
  }
};

// ✅ Delete a moderator
exports.deleteModerator = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid moderator ID format" });
    }

    const moderator = await User.findById(id);

    if (!moderator) {
      return res.status(404).json({ message: "Moderator not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: `Moderator ${moderator.name} deleted successfully` });
  } catch (error) {
    console.error("Error deleting moderator:", error);
    res.status(500).json({ error: "Failed to delete moderator" });
  }
};
