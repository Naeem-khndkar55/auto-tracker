const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Uploads an image to Cloudinary.
 * @param {string} imagePath - The path to the image file.
 * @param {string} folder - The folder in Cloudinary where the image will be stored.
 * @returns {Promise<object>} - A promise that resolves to the Cloudinary upload result.
 */
const uploadImage = async (imagePath, folder = "vehicle_management") => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
    });

    // Delete the temporary file after upload
    fs.unlinkSync(imagePath);

    return result;
  } catch (error) {
    throw new Error("Failed to upload image: " + error.message);
  }
};

module.exports = uploadImage;