
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const {verifyToken, isAdmin} = require('../middleware/auth')

router.get('/dashboard/users', verifyToken, isAdmin, adminController.getAllUsers);
router.delete('/dashboard/users/:id', verifyToken, isAdmin, adminController.deleteUser);
router.put('/dashboard/users/:id', verifyToken, isAdmin, adminController.updateUser);
router.get('/dashboard/chats/reported', verifyToken, isAdmin, adminController.getReportedChats);

router.put('/dashboard/chats/:id/resolve', verifyToken, isAdmin, adminController.resolveChat);


module.exports = router;