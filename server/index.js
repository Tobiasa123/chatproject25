const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set("io", io);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST','DELETE','PUT'],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

const userRoutes = require('./routes/userRoutes');
const chatRoutes  =require('./routes/chatRoutes')
app.use('/',userRoutes);
app.use('/',chatRoutes);

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat room ${chatId}`);
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat room ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://${process.env.URL}:${process.env.PORT}`);
});
