const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  friendId: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  blockedUsers: {
    type: [{ 
      _id: mongoose.Schema.Types.ObjectId, 
      username: String 
    }], 
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;