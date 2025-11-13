// socket/socketHandler.js - Socket.io event handlers

const Message = require('../models/Message');
const User = require('../models/User');

// Store active users and typing status
const activeUsers = new Map(); // socketId -> userId
const typingUsers = new Map(); // room -> Set of userIds

// Helper function to get users in a room
const getUsersInRoom = (room) => {
  return Array.from(activeUsers.entries())
    .filter(([socketId, userData]) => userData.room === room)
    .map(([socketId, userData]) => ({
      id: userData.userId,
      username: userData.username,
      avatar: userData.avatar,
    }));
};

// Helper function to get typing users in a room
const getTypingUsersInRoom = (room) => {
  const typingInRoom = typingUsers.get(room) || new Set();
  return Array.from(typingInRoom).map(userId => {
    const user = Array.from(activeUsers.values()).find(u => u.userId === userId);
    return user ? user.username : null;
  }).filter(Boolean);
};

// Socket event handlers
const handleConnection = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining a room
  socket.on('joinRoom', async (data) => {
    try {
      const { room, token } = data;

      // Here you would verify the JWT token to get user info
      // For now, we'll assume the token is valid and contains userId
      // In a real app, you'd decode the token and get user from DB

      // For demo purposes, we'll use a mock user
      // In production, decode token and fetch user from DB
      const mockUser = {
        userId: 'mock-user-id',
        username: 'MockUser',
        avatar: '',
      };

      // Store user data
      activeUsers.set(socket.id, {
        ...mockUser,
        room,
        socketId: socket.id,
      });

      socket.join(room);

      // Send recent messages
      const recentMessages = await Message.find({ room })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      recentMessages.reverse();

      socket.emit('roomJoined', {
        room,
        messages: recentMessages,
        users: getUsersInRoom(room),
      });

      // Notify others in the room
      socket.to(room).emit('userJoined', {
        user: mockUser,
        message: `${mockUser.username} joined the room`,
      });

      // Update user list for all in room
      io.to(room).emit('userList', getUsersInRoom(room));

      console.log(`${mockUser.username} joined room: ${room}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { message, room } = data;
      const userData = activeUsers.get(socket.id);

      if (!userData || userData.room !== room) {
        return socket.emit('error', { message: 'Not in room' });
      }

      // Save message to database
      const newMessage = await Message.create({
        sender: userData.userId,
        content: message,
        room,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username avatar');

      // Emit to all users in the room
      io.to(room).emit('receiveMessage', populatedMessage);

      console.log(`Message sent in ${room} by ${userData.username}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { room, isTyping } = data;
    const userData = activeUsers.get(socket.id);

    if (!userData || userData.room !== room) return;

    if (!typingUsers.has(room)) {
      typingUsers.set(room, new Set());
    }

    const roomTyping = typingUsers.get(room);

    if (isTyping) {
      roomTyping.add(userData.userId);
    } else {
      roomTyping.delete(userData.userId);
    }

    // Emit typing status to room
    io.to(room).emit('typingUsers', getTypingUsersInRoom(room));
  });

  // Handle read receipts
  socket.on('readMessage', async (data) => {
    try {
      const { messageId, room } = data;
      const userData = activeUsers.get(socket.id);

      if (!userData || userData.room !== room) return;

      // Mark message as read
      await Message.findByIdAndUpdate(messageId, {
        $push: {
          readBy: {
            user: userData.userId,
            readAt: new Date(),
          },
        },
      });

      // Emit read receipt to room
      io.to(room).emit('messageRead', {
        messageId,
        userId: userData.userId,
        readAt: new Date(),
      });
    } catch (error) {
      console.error('Read message error:', error);
    }
  });

  // Handle private messages
  socket.on('sendPrivateMessage', async (data) => {
    try {
      const { recipientId, message } = data;
      const senderData = activeUsers.get(socket.id);

      if (!senderData) return;

      // Save private message
      const newMessage = await Message.create({
        sender: senderData.userId,
        recipient: recipientId,
        content: message,
        isPrivate: true,
      });

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username avatar')
        .populate('recipient', 'username avatar');

      // Find recipient's socket
      const recipientSocket = Array.from(activeUsers.entries())
        .find(([_, userData]) => userData.userId === recipientId)?.[0];

      if (recipientSocket) {
        io.to(recipientSocket).emit('receivePrivateMessage', populatedMessage);
      }

      // Send back to sender
      socket.emit('receivePrivateMessage', populatedMessage);
    } catch (error) {
      console.error('Send private message error:', error);
      socket.emit('error', { message: 'Failed to send private message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    const userData = activeUsers.get(socket.id);

    if (userData) {
      const { room, username, userId } = userData;

      // Update user online status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Remove from active users
      activeUsers.delete(socket.id);

      // Remove from typing users
      if (typingUsers.has(room)) {
        typingUsers.get(room).delete(userId);
      }

      // Notify others in the room
      socket.to(room).emit('userLeft', {
        userId,
        message: `${username} left the room`,
      });

      // Update user list
      io.to(room).emit('userList', getUsersInRoom(room));
      io.to(room).emit('typingUsers', getTypingUsersInRoom(room));

      console.log(`${username} disconnected`);
    }
  });
};

module.exports = {
  handleConnection,
};
