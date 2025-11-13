// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Import controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('./controllers/authController');

const {
  getMessages,
  getPrivateMessages,
  markMessagesAsRead,
} = require('./controllers/messageController');

// Import middleware
const { protect } = require('./middleware/auth');

// Import socket handler
const { handleConnection } = require('./socket/socketHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
// Auth routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', protect, getUserProfile);
app.put('/api/auth/profile', protect, updateUserProfile);

// Message routes
app.get('/api/messages/:room', protect, getMessages);
app.get('/api/messages/private/:userId', protect, getPrivateMessages);
app.put('/api/messages/read', protect, markMessagesAsRead);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Socket.io Chat Server is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
      },
      messages: {
        getRoomMessages: 'GET /api/messages/:room',
        getPrivateMessages: 'GET /api/messages/private/:userId',
        markAsRead: 'PUT /api/messages/read',
      },
    },
  });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  handleConnection(io, socket);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
