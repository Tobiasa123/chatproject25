const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middleware/auth')

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', verifyToken, userController.getProfile);
router.delete('/delete', verifyToken, userController.deleteProfile)


module.exports = router;