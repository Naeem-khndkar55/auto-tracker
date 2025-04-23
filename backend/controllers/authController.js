const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');

 const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'admin' });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
 };


const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const cleanedEmail = email.trim();
    const cleanedPassword = password.trim();

    const userExists = await User.findOne({ email: cleanedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(cleanedPassword, 10);
    const user = new User({
      email: cleanedEmail,
      password: hashedPassword,
      role: 'admin',
    });
    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
  }
  catch (error) {
    console.error(`Registration Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

 module.exports = { loginAdmin, registerAdmin };