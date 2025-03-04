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
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'User', 
    default: [] 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;