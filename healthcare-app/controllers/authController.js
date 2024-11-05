const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, userType });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error to the console
    res.status(400).json({ error: 'User registration failed', details: error.message }); // Send the error message to the client
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Include userType in the response
    res.json({
      message: 'Login successful',
      token,
      userType: user.userType // Add userType here
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
