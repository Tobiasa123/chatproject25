const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController')
const {verifyToken} = require('../middleware/auth')

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/chats', verifyToken ,chatController.createChat);
router.post('/chats/:chatId/messages', verifyToken ,chatController.createMessage);
router.get('/chats/:chatId/messages', verifyToken ,chatController.getChatMessages);
router.get('/user/chats', verifyToken ,chatController.getUserChats);

module.exports = router;