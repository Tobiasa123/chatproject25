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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
const chatRoutes = require('./routes/chatRoutes')
const adminRoutes = require('./routes/adminRoutes')
app.use('/',userRoutes);
app.use('/',chatRoutes);
app.use('/',adminRoutes);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} joined personal update room`);
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat room ${chatId}`);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat room ${chatId}`);
  });

  socket.on("deleteChat", (chatId) => {
    io.emit("chatDeleted", { chatId });
    console.log(`Chat ${chatId} deleted and emitted to all clients.`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});



server.listen(process.env.PORT, () => {
  console.log(`Server running at http://${process.env.URL}:${process.env.PORT}`);
});
