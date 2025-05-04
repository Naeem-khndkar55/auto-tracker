const mongoose = require("mongoose");

 const SettingsSchema = new mongoose.Schema({
  secret: { type: String, required: true },
  is_mantainance: { type: Boolean, default: false },
  maintenance_message: {
    type: String,
    default: "We are currently under maintenance, we will be back soon.",
  },
 });



module.exports = mongoose.model("Settings", SettingsSchema);