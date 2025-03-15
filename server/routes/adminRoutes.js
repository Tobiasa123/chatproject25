
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const {verifyToken, isAdmin} = require('../middleware/auth')

router.get('/dashboard/users', verifyToken, isAdmin, adminController.getAllUsers);


module.exports = router;