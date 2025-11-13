// components/ChatWindow.jsx - Chat messages display component

import React from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, currentUser, typingUsers, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id || message._id}
              className={`message ${
                message.type === 'system' ? 'system-message' :
                message.sender?._id === currentUser?._id ? 'own-message' : 'other-message'
              }`}
            >
              {message.type === 'system' ? (
                <div className="system-content">
                  <span>{message.content}</span>
                </div>
              ) : (
                <>
                  <div className="message-header">
                    <span className="sender-name">
                      {message.sender?.username || 'Unknown'}
                    </span>
                    <span className="message-time">
                      {formatTime(message.timestamp || message.createdAt)}
                    </span>
                  </div>
                  <div className="message-content">
                    {message.content}
                  </div>
                  {message.isPrivate && (
                    <div className="private-indicator">Private</div>
                  )}
                  {message.readBy && message.readBy.length > 0 && (
                    <div className="read-receipt">
                      ✓ Read by {message.readBy.length} user{message.readBy.length > 1 ? 's' : ''}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
