const express = require('express');
const { login,register,profile } = require('../controllers/userController');
const { protect} = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get("/profile", protect, profile);


module.exports = router;
