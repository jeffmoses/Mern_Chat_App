// components/MessageInput.jsx - Message input component

import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import './MessageInput.css';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendMessage, setTyping } = useSocket();
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setTyping(true);
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-group">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
            className="message-textarea"
            maxLength="500"
          />
          <button
            type="submit"
            className="send-button"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </form>
      <div className="message-info">
        <span className="char-count">
          {message.length}/500
        </span>
        <span className="help-text">
          Press Enter to send, Shift+Enter for new line
        </span>
      </div>
    </div>
  );
};

export default MessageInput;
