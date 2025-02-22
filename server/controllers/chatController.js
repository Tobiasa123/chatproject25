const User = require('../models/userModel')
const Chat = require('../models/chatModel')



exports.createChat = async (req, res) => {
    const userId1 = req.user._id;
    const {userId2} = req.body;

    try {
        if (!userId1 || !userId2) {
            return res.status(400).send({ message: 'Both user IDs are required' });
        }
        const user1 = await User.findById(userId1);
        const user2 = await User.findById(userId2);

        if (!user1 || !user2) {
        return res.status(404).send({ message: 'One or both users not found' });
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
      
          res.status(201).send({ message: 'Chat created successfully', chat: newChat });
    } catch (err) {
        res.status(500).send({ message: 'Error creating chat', error: err.message });
    }
}
exports.createMessage = async (req, res) => {
    const  senderId  = req.user._id; 
    const { chatId } = req.params; 
    const { text } = req.body; 

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).send({ message: 'Chat not found' });
        }

        if (!chat.participants.includes(senderId)) {
            return res.status(403).send({ message: 'Sender is not part of this chat' });
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
    
        res.status(201).send({ message: 'Message sent successfully', chat });
    } catch (err) {
        res.status(500).send({ message: 'Error sending message', error: err.message });
    }
};
exports.getChatMessages = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).send({ message: 'Chat not found' });
        }

        if (userId && !chat.participants.includes(userId)) {
            return res.status(403).send({ message: 'User is not part of this chat' });
        }

        res.status(200).send({ messages: chat.messages });
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving messages', error: err.message });
    }
};
exports.getUserChats = async (req, res) => {
    const userId = req.user._id; 
  
    try {
 
      const chats = await Chat.find({ participants: userId })
        .populate('participants', 'username email') 
        .exec();
  
      if (!chats || chats.length === 0) {
        return res.status(404).send({ message: 'No chats found for this user' });
      }

      const chatIds = chats.map(chat => chat._id);
      const chatParticipants = chats.map(chat => chat.participants);
    //   const chatParticipants = chats.map(chat => {
    //     // Remove the logged-in user from the participants
    //     return chat.participants.filter(participant => participant._id.toString() !== userId.toString());
    // });

    const chatData = chats.map(chat => ({
        chatId: chat._id,
        participants: chat.participants.map(participant => participant.username) // Or any other participant info you need
      }));

      res.status(200).send({chatData});
    } catch (err) {
      res.status(500).send({ message: 'Error fetching chats', error: err.message });
    }
  };