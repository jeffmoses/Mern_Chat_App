// pages/ChatPage.jsx - Main chat page component

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import './Chat.css';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const {
    isConnected,
    currentRoom,
    messages,
    users,
    typingUsers,
    joinRoom,
    leaveRoom,
  } = useSocket();

  const [selectedRoom, setSelectedRoom] = useState('general');
  const messagesEndRef = useRef(null);

  // Join room when component mounts or room changes
  useEffect(() => {
    if (isConnected && selectedRoom !== currentRoom) {
      joinRoom(selectedRoom);
    }
  }, [isConnected, selectedRoom, currentRoom, joinRoom]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRoomChange = (room) => {
    if (currentRoom) {
      leaveRoom();
    }
    setSelectedRoom(room);
  };

  const availableRooms = ['general', 'random', 'tech', 'gaming'];

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
        <div className="connection-status">
          <span className={isConnected ? 'connected' : 'disconnected'}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </div>

      <div className="chat-container">
        <div className="sidebar">
          <div className="rooms-section">
            <h3>Rooms</h3>
            <div className="rooms-list">
              {availableRooms.map((room) => (
                <button
                  key={room}
                  className={`room-btn ${selectedRoom === room ? 'active' : ''}`}
                  onClick={() => handleRoomChange(room)}
                >
                  #{room}
                </button>
              ))}
            </div>
          </div>

          <UserList users={users} />
        </div>

        <div className="chat-main">
          <div className="room-header">
            <h2>#{selectedRoom}</h2>
            <span className="user-count">{users.length} users online</span>
          </div>

          <ChatWindow
            messages={messages}
            currentUser={user}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
          />

          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
