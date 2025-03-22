const User = require("../models/User");

// ✅ Create Moderator
const createModerator = async (req, res) => {
  try {
    const { name, email, phone, password, image } = req.body;

    // ✅ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create a new moderator
    const newModerator = new User({
      name,
      email,
      phone,
      password,
      image,
      role: "moderator", // ✅ Set role to "moderator"
    });

    await newModerator.save();

    res.status(201).json(newModerator);
  } catch (err) {
    console.error("Error creating moderator:", err);
    res.status(500).json({ message: "Failed to create moderator" });
  }
};

// ✅ Get All Moderators
const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" }).select("-password");
    res.status(200).json(moderators);
  } catch (err) {
    console.error("Error fetching moderators:", err);
    res.status(500).json({ message: "Failed to fetch moderators" });
  }
};

// ✅ Delete Moderator
const deleteModerator = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedModerator = await User.findByIdAndDelete(id);

    if (!deletedModerator) {
      return res.status(404).json({ message: "Moderator not found" });
    }

    res.status(200).json({ message: "Moderator deleted successfully" });
  } catch (err) {
    console.error("Error deleting moderator:", err);
    res.status(500).json({ message: "Failed to delete moderator" });
  }
};

module.exports = {
  createModerator,
  getModerators,
  deleteModerator,
};
