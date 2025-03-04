const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blockedUsers: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
    ref: 'User', // Reference to the User model
    default: [] // Starts as an empty array
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;