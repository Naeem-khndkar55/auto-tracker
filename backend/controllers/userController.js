const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const cleanedUsername = username.trim();
    const cleanedPassword = password.trim();

    const userExists = await User.findOne({ username: cleanedUsername });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(cleanedPassword, 10);

    const user = new User({
      username: cleanedUsername,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(`Registration Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const cleanedUsername = username.trim();
    const cleanedPassword = password.trim();

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${cleanedUsername}$`, 'i') },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordMatch = await bcrypt.compare(cleanedPassword, user.password);

    if (isPasswordMatch) {
      // ✅ Issue token with expiration of 1 hour
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // ✅ Expiration after 1 hour
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, register };
