// context/SocketContext.jsx - Socket.io context

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { socket } from '../socket/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user && token) {
      socket.auth = { token };
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
      console.log('Connected to server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    };

    // Room events
    const onRoomJoined = (data) => {
      setCurrentRoom(data.room);
      setMessages(data.messages);
      setUsers(data.users);
    };

    const onUserJoined = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `${data.user.username} joined the room`,
        timestamp: new Date(),
      }]);
    };

    const onUserLeft = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `${data.user.username} left the room`,
        timestamp: new Date(),
      }]);
    };

    const onUserList = (userList) => {
      setUsers(userList);
    };

    // Message events
    const onReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const onReceivePrivateMessage = (message) => {
      setMessages(prev => [...prev, message]);
      // Update unread count for private messages
      setUnreadCounts(prev => ({
        ...prev,
        [message.sender._id]: (prev[message.sender._id] || 0) + 1,
      }));
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Read receipt events
    const onMessageRead = (data) => {
      // Update message read status
      setMessages(prev => prev.map(msg =>
        msg._id === data.messageId
          ? { ...msg, readBy: [...(msg.readBy || []), data.userId] }
          : msg
      ));
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('roomJoined', onRoomJoined);
    socket.on('userJoined', onUserJoined);
    socket.on('userLeft', onUserLeft);
    socket.on('userList', onUserList);
    socket.on('receiveMessage', onReceiveMessage);
    socket.on('receivePrivateMessage', onReceivePrivateMessage);
    socket.on('typingUsers', onTypingUsers);
    socket.on('messageRead', onMessageRead);

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('roomJoined', onRoomJoined);
      socket.off('userJoined', onUserJoined);
      socket.off('userLeft', onUserLeft);
      socket.off('userList', onUserList);
      socket.off('receiveMessage', onReceiveMessage);
      socket.off('receivePrivateMessage', onReceivePrivateMessage);
      socket.off('typingUsers', onTypingUsers);
      socket.off('messageRead', onMessageRead);
    };
  }, []);

  // Join a room
  const joinRoom = (room) => {
    socket.emit('joinRoom', { room, token });
  };

  // Send message to current room
  const sendMessage = (content) => {
    socket.emit('sendMessage', { message: content, room: currentRoom });
  };

  // Send private message
  const sendPrivateMessage = (recipientId, content) => {
    socket.emit('sendPrivateMessage', { recipientId, message: content });
  };

  // Set typing status
  const setTyping = (isTyping) => {
    socket.emit('typing', { room: currentRoom, isTyping });
  };

  // Mark message as read
  const markAsRead = (messageId) => {
    socket.emit('readMessage', { messageId, room: currentRoom });
  };

  // Leave current room
  const leaveRoom = () => {
    socket.emit('leaveRoom', { room: currentRoom });
    setCurrentRoom(null);
    setMessages([]);
    setUsers([]);
  };

  const value = {
    socket,
    isConnected,
    currentRoom,
    messages,
    users,
    typingUsers,
    unreadCounts,
    joinRoom,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    markAsRead,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
