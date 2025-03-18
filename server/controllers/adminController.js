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
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, role } = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        user.email = email || user.email; 
        user.role = role || user.role;

        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};
exports.getReportedChats = async (req, res) => {
    try {
      const reportedChats = await Chat.find({ reported: true })
        .populate('participants', 'username') 
        .populate('messages.sender', 'username');
  
      res.status(200).send({ reportedChats });
    } catch (err) {
      res.status(500).send({ message: 'Error fetching reported chats', error: err.message });
    }
  };
  
  exports.resolveChat = async (req, res) => {
    try {
      const chatId = req.params.id; 
  
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      chat.reported = false;
      chat.reportReason = '';
  
      await chat.save();
  
      res.status(200).json({ message: 'Chat resolved successfully', chat });
    } catch (error) {
      res.status(500).json({ message: 'Error resolving chat', error: error.message });
    }
  };
  