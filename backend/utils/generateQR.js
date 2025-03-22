const qrcode = require("qrcode");

/**
 * Generates a QR code from the given data and returns it as a data URL.
 * @param {string} data - The data to encode in the QR code.
 * @returns {Promise<string>} - A promise that resolves to the QR code data URL.
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code: " + error.message);
  }
};

module.exports = generateQRCode;