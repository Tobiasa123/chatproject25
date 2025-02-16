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


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    credentials: true
}));


mongoose.connect(process.env.MONGO_URL);


const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running at http://${process.env.URL}:${process.env.PORT}`);
});