const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middleware/auth')

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/profile', verifyToken, userController.getProfile);
router.get('/profile/:id', verifyToken, userController.getUserProfileById);

router.put('/profile/edit', verifyToken, userController.editProfile); 

router.delete('/delete', verifyToken, userController.deleteProfile)

router.post('/block/:id', verifyToken, userController.blockUser);
router.post('/unblock/:id', verifyToken, userController.unblockUser);

router.get('/users/search', verifyToken, userController.getUsersByUsername)


module.exports = router;