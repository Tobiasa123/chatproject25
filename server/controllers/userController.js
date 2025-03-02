const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const jwtkey = process.env.SECRET_KEY

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id}, jwtkey, {expiresIn: '2h'})

    res.status(201).send({
        user: {
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
          },
          token, 
    });
  } catch (err) {
    res.status(500).send({ message: 'Error registering user', error: err.message });
  }
};
exports.loginUser = async (req, res) => {
    const {email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'Invalid email or password' });
        }
  
      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
      const token = jwt.sign({ _id: user._id}, jwtkey, {expiresIn: '2h'})
  
      res.status(201).send({
          user: {
              username: user.username,
              email: user.email,
              createdAt: user.createdAt,
            },
            token, 
      });
    } catch (err) {
      res.status(500).send({ message: 'Error logging in user', error: err.message });
    }
  };
  exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user profile', error: err.message });
    }
  };
  exports.deleteProfile = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user profile', error: err.message });
    }
  };
  