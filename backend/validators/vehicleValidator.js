const { check, validationResult } = require('express-validator');

const validateVehicle = [
  check('ownerName').notEmpty().withMessage('Owner name is required'),
  check('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
  check('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  check('permittedRoute').notEmpty().withMessage('Permitted route is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateVehicle };
