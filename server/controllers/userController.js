const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const jwtkey = process.env.SECRET_KEY
const sendEmail = require('../utils/mailer')

//for users
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
  
    const emailRegex = /^[a-zA-Z0-9åäöÅÄÖ.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const sanitizedEmail = email.trim().toLowerCase(); 
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    //password regex
    const passwordRegex = /^(?=.*[a-zåäö])(?=.*[A-ZÅÄÖ])(?=.*\d)(?=.*[^\w\s])[A-Za-zÅÄÖåäö\d@$!%*?&.,;:_+={}[\]()<>-]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain a mix of uppercase, lowercase, numbers, and special characters.'
      });
    }

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

    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username, role: newUser.role }, 
      jwtkey, 
      { expiresIn: '2h' }
    );

    const registrationMessage = 'Thank you for registering with us!';
    const contactInfo = '\n\nIf you have any inquiries or questions, please contact us at tobiaserikandersson@gmail.com.';

    await sendEmail(sanitizedEmail, 'Welcome to EveryTen', registrationMessage + contactInfo);

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
  
    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role }, 
      jwtkey, 
      { expiresIn: '2h' }
    );
  
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
  exports.getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); 

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
  exports.blockUser = async (req, res) => {
    try {
      const userId = req.user._id; 
      const blockedUserId = req.params.id; 
  
      if (userId.toString() === blockedUserId) {
        return res.status(400).json({ message: "You cannot block yourself" });
      }
  
      const user = await User.findById(userId);
      const blockedUser = await User.findById(blockedUserId);
  
      if (!user || !blockedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.blockedUsers.some(user => user._id.toString() === blockedUserId)) {
        return res.status(400).json({ message: "User already blocked" });
      }
  
      user.blockedUsers.push({ _id: blockedUserId, username: blockedUser.username });
      await user.save();
  
      res.status(200).json({ message: "User blocked successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error blocking user", error: err.message });
    }
  };
  
  
  exports.unblockUser = async (req, res) => {
    try {
      const userId = req.user._id; 
      const blockedUserId = req.params.id; 
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!user.blockedUsers.some(user => user._id.toString() === blockedUserId)) {
        return res.status(400).json({ message: "User is not blocked" });
      }
  
      user.blockedUsers = user.blockedUsers.filter(user => user._id.toString() !== blockedUserId);
      await user.save();
  
      res.status(200).json({ message: "User unblocked successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error unblocking user", error: err.message });
    }
  };
  exports.editProfile = async (req, res) => {
    const userId = req.user._id;
    const { username, email, password, isPublic  } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            user.email = email;
        }
        if (typeof isPublic === 'boolean') {
          user.isPublic = isPublic;
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: user.username,
                email: user.email,
                isPublic: user.isPublic,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};
exports.getUsersByUsername = async (req, res) => {
  try {
    const { username } = req.query; 
    const userId = req.user._id; 


    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: userId },
    });

    res.json(users); 
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
