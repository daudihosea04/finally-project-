import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Send, Paperclip, X, File, Image, RefreshCw, Users, MessageCircle, Lock } from 'lucide-react';

const ChatComponent = ({ receiverId, receiverName, type = 'user', onClose }) => {
  const { user } = useAuth();
  const themeContext = useTheme();
  
  const safeColors = themeContext?.colors || {
    background: '#f9fafb',
    border: '#e5e7eb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textSubtle: '#9ca3af',
    primary: '#3b82f6',
    secondary: '#10b981',
    error: '#ef4444'
  };
  
  const colors = safeColors;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!receiverId) return;
    
    console.log('Loading messages for receiver:', receiverId);
    setLoading(true);
    
    try {
      // CORRECTED ENDPOINT for private messages
      const response = await api.get(`/chat/private/${receiverId}/messages`);
      
      if (response.data && response.data.success) {
        let newMessages = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          newMessages = response.data.data;
        } else if (Array.isArray(response.data.messages)) {
          newMessages = response.data.messages;
        } else if (Array.isArray(response.data)) {
          newMessages = response.data;
        }
        
        setMessages(newMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [receiverId]);
  
  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) {
      alert('Please enter a message');
      return;
    }
    if (!receiverId) {
      alert('No receiver selected');
      return;
    }
    
    setSending(true);
    
    try {
      const messageText = newMessage.trim() || (selectedFile ? 'Sent a file' : '');
      
      // CORRECTED ENDPOINT
      const payload = {
        recipient_id: parseInt(receiverId),
        message: messageText,
        sender_id: user?.id,
        sender_name: user?.name
      };
      
      let response;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('recipient_id', parseInt(receiverId));
        formData.append('message', messageText);
        formData.append('file', selectedFile);
        response = await api.post('/chat/private/send', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/chat/private/send', payload);
      }
      
      if (response.data && response.data.success) {
        setNewMessage('');
        setSelectedFile(null);
        await loadMessages();
        scrollToBottom();
      } else {
        throw new Error(response.data?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSending(false);
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
    
    if (file && file.size <= 10 * 1024 * 1024) {
      if (allowedTypes.includes(file.type) || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        alert('File type not supported');
      }
    } else {
      alert('File too large. Max 10MB');
    }
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      const date = formatDate(msg.created_at);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };
  
  const isOwnMessage = (msg) => {
    return msg.sender_id === user?.id;
  };
  
  // Initial load
  useEffect(() => {
    if (receiverId) {
      loadMessages();
    }
  }, [receiverId, loadMessages]);
  
  // Polling for real-time messages
  useEffect(() => {
    if (!receiverId) return;
    
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    
    pollingInterval.current = setInterval(() => {
      loadMessages();
    }, 3000);
    
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [receiverId, loadMessages]);
  
  const messageGroups = groupMessagesByDate();
  const displayName = receiverName || `User ${receiverId}`;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="flex flex-col h-[600px] w-full max-w-2xl rounded-xl shadow-2xl" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
              <Lock size={20} style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: colors.textPrimary }}>{displayName}</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Private Chat • {messages.length} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={loadMessages} 
              className="p-2 rounded-full hover:bg-opacity-10 transition-all"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <RefreshCw size={16} style={{ color: colors.primary }} />
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-opacity-10 transition-all"
                style={{ backgroundColor: `${colors.error}10` }}
              >
                <X size={18} style={{ color: colors.error }} />
              </button>
            )}
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && messages.length === 0 && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }} />
            </div>
          )}
          
          {!loading && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${colors.primary}10` }}>
                <MessageCircle size={32} style={{ color: colors.primary }} />
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>No messages yet. Start the conversation!</p>
            </div>
          )}
          
          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center my-3">
                <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}10`, color: colors.textSecondary }}>
                  {date}
                </span>
              </div>
              {msgs.map((msg) => {
                const ownMessage = isOwnMessage(msg);
                
                return (
                  <div
                    key={msg.id}
                    className={`flex mb-3 animate-slide-in ${ownMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 ${
                        ownMessage ? 'rounded-br-md' : 'rounded-bl-md'
                      }`}
                      style={{
                        backgroundColor: ownMessage ? colors.primary : `${colors.primary}10`,
                        color: ownMessage ? '#ffffff' : colors.textPrimary
                      }}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                      {msg.file_url && (
                        <div className="mt-2">
                          {msg.file_type?.startsWith('image/') ? (
                            <img 
                              src={msg.file_url} 
                              alt="Attachment" 
                              className="max-w-full rounded-lg max-h-48 cursor-pointer"
                              onClick={() => window.open(msg.file_url, '_blank')}
                            />
                          ) : (
                            <a 
                              href={msg.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 underline"
                              style={{ color: ownMessage ? '#ffffff' : colors.primary }}
                            >
                              <File size={12} /> {msg.file_name || 'Download'}
                            </a>
                          )}
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70 text-right">{formatTime(msg.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* File Preview */}
        {selectedFile && (
          <div className="mx-4 mb-2 p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}>
            <div className="flex items-center gap-3">
              {selectedFile.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                  <File size={20} style={{ color: colors.primary }} />
                </div>
              )}
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: colors.textPrimary }}>{selectedFile.name}</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => setSelectedFile(null)}>
              <X size={16} style={{ color: colors.error }} />
            </button>
          </div>
        )}
        
        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex items-end gap-2">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            <button 
              className="p-2.5 rounded-xl hover:bg-opacity-10 transition-all flex-shrink-0"
              style={{ backgroundColor: `${colors.primary}10` }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} style={{ color: colors.textSecondary }} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !sending) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={`Type a message to ${displayName}...`}
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 resize-none"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  outline: 'none'
                }}
                disabled={sending}
                autoFocus
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && !selectedFile) || sending}
              className="p-2.5 rounded-xl transition-all flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: colors.primary,
                opacity: (!newMessage.trim() && !selectedFile) || sending ? 0.5 : 1,
                cursor: (!newMessage.trim() && !selectedFile) || sending ? 'not-allowed' : 'pointer'
              }}
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Send size={18} color="#ffffff" />
              )}
            </button>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs" style={{ color: colors.textSubtle }}>
              🔒 Private & Encrypted • Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;