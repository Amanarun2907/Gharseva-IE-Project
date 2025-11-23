import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ChatBot.css';

const ChatBot = () => {
  const { user, isAuthenticated } = useAuth();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (show && messages.length === 0) {
      // Add welcome message based on role
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [show]);

  const getWelcomeMessage = () => {
    if (user?.role === 'customer') {
      return `Hello ${user.name}! 👋 I'm your GharSewa assistant. I can help you with:\n\n• Booking services\n• Checking your booking status\n• Finding workers\n• Payment information\n• General platform help\n\nHow can I assist you today?`;
    }
    if (user?.role === 'worker') {
      return `Hello ${user.name}! 👋 I'm your GharSewa assistant. I can help you with:\n\n• Managing your bookings\n• Checking your earnings\n• Accepting/rejecting bookings\n• Profile updates\n• Platform guidelines\n\nWhat would you like to know?`;
    }
    if (user?.role === 'admin') {
      return `Hello ${user.name}! 👋 I'm your GharSewa admin assistant. I can help you with:\n\n• System statistics\n• User management\n• Booking oversight\n• Revenue analytics\n• Platform settings\n\nHow can I help you manage the platform?`;
    }
    return 'Hello! How can I help you today?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Sending chat request:', { message: inputMessage, historyLength: conversationHistory.length });

      const response = await axios.post('/chatbot/chat', {
        message: inputMessage,
        conversationHistory
      });

      console.log('Chat response:', response.data);

      const aiMessage = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.message || error.response?.data?.details || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }]);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div className="chatbot-float-button" onClick={handleShow}>
        <FaComments size={24} />
        <span className="chatbot-badge">AI</span>
      </div>

      {/* Chat Modal */}
      <Modal show={show} onHide={handleClose} className="chatbot-modal" centered>
        <Modal.Header className="chatbot-header">
          <div className="d-flex align-items-center">
            <div className="chatbot-avatar">
              <FaRobot size={24} />
            </div>
            <div className="ms-3">
              <h5 className="mb-0">GharSewa Assistant</h5>
              <small className="text-muted">
                {user?.role === 'customer' ? 'Customer Support' : 
                 user?.role === 'worker' ? 'Worker Support' : 
                 'Admin Support'}
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="link" size="sm" onClick={clearChat} className="text-white">
              Clear
            </Button>
            <Button variant="link" size="sm" onClick={handleClose} className="text-white">
              <FaTimes size={20} />
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-avatar">
                  {msg.role === 'user' ? <FaUser size={16} /> : <FaRobot size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message ai-message">
                <div className="message-avatar">
                  <FaRobot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Modal.Body>

        <Modal.Footer className="chatbot-footer">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="chatbot-input"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
            className="chatbot-send-btn"
          >
            {loading ? <Spinner animation="border" size="sm" /> : <FaPaperPlane />}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatBot;
