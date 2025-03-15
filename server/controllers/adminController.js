const User = require('../models/userModel')
const Chat = require('../models/chatModel')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};