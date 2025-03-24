const User = require('../models/userModel')
const Chat = require('../models/chatModel')


//for chats
exports.createChat = async (req, res) => {
  try {
    const userId1 = req.user._id; 
    const { username } = req.body;

    if (!userId1 || !username) {
      return res.status(400).send({ message: 'Authenticated user ID and recipient username (or friendId) are required' });
    }

    // either username or friendID
    const user2 = await User.findOne({
      $or: [
        { username: username },
        { friendId: username }
      ]
    });
    
    if (!user2) {
      return res.status(404).send({ message: 'User not found' });
    }

    // bypass privacy if useing friendID
    if (username !== user2.friendId) {
      if (user2.isPublic === false) {
        return res.status(403).send({ message: 'This user is private' });
      }
    }

    const userId2 = user2._id;
    if (userId1.toString() === userId2.toString()) {
      return res.status(400).send({ message: 'You cannot start a chat with yourself' });
    }

    const user1 = await User.findById(userId1);
    if (!user1) return res.status(404).send({ message: 'User not found' });

    if (user1.blockedUsers.includes(userId2)) {
      return res.status(403).send({ message: 'You have blocked this user' });
    }

    if (user2.blockedUsers.includes(userId1)) {
      return res.status(403).send({ message: 'You have been blocked by this user' });
    }

    const existingChat = await Chat.findOne({
      participants: { $all: [userId1, userId2] },
    });
    if (existingChat) {
      return res.status(200).send({ message: 'Chat already exists', chat: existingChat });
    }

    const newChat = new Chat({
      participants: [userId1, userId2],
    });
    await newChat.save();

    const io = req.app.get("io");
    io.emit("newChat", newChat);

    res.status(201).send({ message: 'Chat created successfully', chat: newChat });
  } catch (err) {
    res.status(500).send({ message: 'Error creating chat', error: err.message });
  }
};

  

  exports.createMessage = async (req, res) => {
    const senderId = req.user._id;
    const { chatId } = req.params;
    const { text } = req.body;
  
    try {
        const chat = await Chat.findById(chatId).populate("participants");
  
        if (!chat) return res.status(404).send({ message: "Chat not found" });
  
        if (!chat.participants.some(user => user._id.toString() === senderId.toString())) {
            return res.status(403).send({ message: "Sender is not part of this chat" });
        }
  
        const newMessage = {
            sender: senderId,
            text,
            timestamp: new Date(),
        };
  
        chat.messages.push(newMessage);
        await chat.save();
  
        const io = req.app.get("io");
  
        io.to(chatId).emit("newMessage", newMessage);
  
        chat.participants.forEach(user => {
            io.to(user._id.toString()).emit("updateChatList", {
                chatId,
                latestMessage: newMessage.text,
                latestTimestamp: newMessage.timestamp,
                latestSenderId: newMessage.sender,
            });
        });
  
        res.status(201).send({ message: "Message sent successfully", chat });
    } catch (err) {
        res.status(500).send({ message: "Error sending message", error: err.message });
    }
  };
  

exports.getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  try {
      const chat = await Chat.findById(chatId).populate('participants', 'username email'); 

      if (!chat) {
          return res.status(404).send({ message: 'Chat not found' });
      }

      if (userId && !chat.participants.some(participant => participant._id.toString() === userId.toString())) {
          return res.status(403).send({ message: 'User is not part of this chat' });
      }

      const otherParticipant = chat.participants.find(participant => participant._id.toString() !== userId.toString());

      res.status(200).send({ 
          messages: chat.messages,
          otherUser: otherParticipant ? { id: otherParticipant._id, username: otherParticipant.username } : null
      });
  } catch (err) {
      res.status(500).send({ message: 'Error retrieving messages', error: err.message });
  }
};

exports.getUserChats = async (req, res) => {
    const userId = req.user._id;
  
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
  
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'username email blockedUsers')
            .sort({ updatedAt: -1 }) 
            .exec();
  
        if (!chats || chats.length === 0) {
            return res.status(200).send({ chatData: [] });
        }
  
        const chatData = chats
            .map(chat => {
                const otherParticipants = chat.participants.filter(
                    participant => participant._id.toString() !== userId.toString()
                );
                const otherUser = otherParticipants[0];
  
                if (!otherUser) return null;
  
                const userBlockedOther = user.blockedUsers.some(blockedUser => blockedUser._id.toString() === otherUser._id.toString());
  
                const otherBlockedUser = otherUser.blockedUsers.some(blockedUser => blockedUser._id.toString() === userId.toString());
  
                if (userBlockedOther || otherBlockedUser) return null;
  
                return {
                    chatId: chat._id,
                    otherUser: { username: otherUser.username, _id: otherUser._id },
                    updatedAt: chat.updatedAt,
                    latestMessage: chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].text 
                    : 'No messages yet',
                    latestTimestamp: chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].timestamp 
                    : null,
                    latestSenderId: chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].sender
                    : null
                    
                };
            })
            .filter(chat => chat !== null);
  
        res.status(200).send({ chatData });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching chats', error: err.message });
    }
  };
  exports.deleteChat = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).send({ message: "Chat not found" });
        }

        if (!chat.participants.includes(userId)) {
            return res.status(403).send({ message: "You are not allowed to delete this chat" });
        }

        await Chat.findByIdAndDelete(chatId);

        const io = req.app.get("io");
        io.emit("chatDeleted", { chatId });

        res.status(200).send({ message: "Chat deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error deleting chat", error: err.message });
    }
};
exports.reportChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const { reason } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send({ message: 'Chat not found' });
    }

    chat.reported = true;
    chat.reportReason = reason;
    await chat.save();

    res.status(200).send({ message: 'Chat reported successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error reporting chat', error: err.message });
  }
};