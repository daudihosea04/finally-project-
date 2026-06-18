// src/components/LiveChat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { initWebSocket, getEcho, leaveChannelByName } from '../services/websocket';
import { Send, Paperclip, X, File, Users, MessageCircle, Lock, Globe, Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import './LiveChat.css';

const LiveChat = ({ chatType, chatId, chatName, onClose, role = 'student' }) => {
  const { user } = useAuth();
  
  const colors = {
    primary: '#659EC7',
    primaryLight: '#8BB8D9',
    primaryDark: '#4A7DA3',
    background: '#f9fafb',
    border: '#e5e7eb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textSubtle: '#9ca3af',
    secondary: '#10b981',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b'
  };
  
  // ========== STATE MANAGEMENT ==========
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  
  // ========== REFS ==========
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isMounted = useRef(true);
  const currentChannel = useRef(null);
  const echoInstance = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);
  const currentChannelName = useRef(null);
  const pollingInterval = useRef(null);
  const pollingActive = useRef(false);
  const hasInitialized = useRef(false);
  
  // ========== HELPER FUNCTIONS ==========
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const showNotification = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(null), 5000);
    }
  };
  
  // ========== SAFE CHANNEL CLEANUP ==========
  const safeCleanupChannel = useCallback(() => {
    console.log('🔄 Performing safe channel cleanup');
    
    if (currentChannelName.current && 
        typeof currentChannelName.current === 'string' && 
        currentChannelName.current.length > 0) {
      try {
        leaveChannelByName(currentChannelName.current);
        console.log(`👋 Left channel by name: ${currentChannelName.current}`);
      } catch (err) {
        console.warn('Error leaving by name:', err);
      }
    }
    
    if (currentChannel.current && typeof currentChannel.current === 'object') {
      try {
        if (typeof currentChannel.current.stopListening === 'function') {
          let channelName = null;
          try {
            if (currentChannel.current.name && typeof currentChannel.current.name === 'string') {
              channelName = currentChannel.current.name;
            }
          } catch (nameError) {
            console.warn('Could not get channel name:', nameError);
          }
          
          if (channelName && channelName.length > 0) {
            try {
              currentChannel.current.stopListening(channelName);
              console.log(`🛑 Stopped listening on channel: ${channelName}`);
            } catch (stopError) {
              try {
                currentChannel.current.stopListening();
                console.log('🛑 Stopped listening (fallback)');
              } catch (e2) {
                console.warn('Fallback stopListening failed:', e2);
              }
            }
          } else {
            try {
              currentChannel.current.stopListening();
              console.log('🛑 Stopped listening (no name)');
            } catch (e) {
              console.warn('stopListening without name failed:', e);
            }
          }
        }
      } catch (err) {
        console.warn('Error cleaning up channel object:', err);
      }
    }
    
    try {
      const echo = getEcho();
      if (echo && typeof echo.leave === 'function') {
        if (currentChannelName.current && 
            typeof currentChannelName.current === 'string' && 
            currentChannelName.current.length > 0) {
          try {
            echo.leave(currentChannelName.current);
          } catch (e) {}
        }
      }
    } catch (err) {}
    
    currentChannel.current = null;
    currentChannelName.current = null;
    
    console.log('✅ Safe cleanup completed');
  }, []);
  
  // ========== STOP POLLING ==========
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      console.log('🛑 Stopping polling');
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
      pollingActive.current = false;
    }
  }, []);
  
  // ========== START POLLING ==========
  const startPolling = useCallback(() => {
    stopPolling();
    
    if (chatType !== 'course') {
      return;
    }
    
    if (pollingActive.current) {
      return;
    }
    
    console.log('🔄 Starting polling mode for course chat (every 5 seconds)');
    pollingActive.current = true;
    
    fetchMessages();
    
    pollingInterval.current = setInterval(() => {
      if (!isMounted.current || !chatId) {
        stopPolling();
        return;
      }
      fetchMessages();
    }, 5000);
  }, [chatType, chatId, stopPolling]);
  
  // ========== FETCH MESSAGES ==========
  const fetchMessages = useCallback(async () => {
    if (!chatId || !isMounted.current) {
      return;
    }
    
    try {
      let response;
      
      if (chatType === 'private') {
        response = await api.get(`/chat/private/${chatId}/messages`);
      } else if (chatType === 'group') {
        response = await api.get(`/chat/group/${chatId}/messages`);
      } else if (chatType === 'course') {
        response = await api.get(`/chat/course/${chatId}/messages`);
      } else {
        return;
      }
      
      if (response.data && response.data.success !== false && isMounted.current) {
        let newMessages = [];
        
        if (response.data.data?.messages) {
          newMessages = response.data.data.messages;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          newMessages = response.data.data;
        } else if (Array.isArray(response.data.messages)) {
          newMessages = response.data.messages;
        } else if (Array.isArray(response.data)) {
          newMessages = response.data;
        }
        
        if (newMessages.length > 0) {
          const lastMsg = newMessages[newMessages.length - 1];
          setLastMessageId(lastMsg.id);
        }
        
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
          
          if (uniqueNew.length === 0) {
            return prev;
          }
          
          console.log(`✅ Adding ${uniqueNew.length} new messages`);
          return [...prev, ...uniqueNew];
        });
        scrollToBottom();
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching messages:', error);
      }
    }
  }, [chatType, chatId, scrollToBottom]);
  
  // ========== LOAD MESSAGES ==========
  const loadMessages = useCallback(async () => {
    if (!chatId || !isMounted.current) {
      return;
    }
    
    console.log('🔄 Loading messages for:', { chatType, chatId });
    setError(null);
    
    try {
      let response;
      
      if (chatType === 'private') {
        response = await api.get(`/chat/private/${chatId}/messages`);
      } else if (chatType === 'group') {
        response = await api.get(`/chat/group/${chatId}/messages`);
      } else if (chatType === 'course') {
        response = await api.get(`/chat/course/${chatId}/messages`);
      } else {
        return;
      }
      
      console.log('📦 Full API Response:', response);
      console.log('📦 Response data:', response.data);
      
      if (response.data && response.data.success !== false && isMounted.current) {
        let newMessages = [];
        
        if (response.data.data?.messages) {
          newMessages = response.data.data.messages;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          newMessages = response.data.data;
        } else if (Array.isArray(response.data.messages)) {
          newMessages = response.data.messages;
        } else if (Array.isArray(response.data)) {
          newMessages = response.data;
        }
        
        console.log(`✅ Loaded ${newMessages.length} messages`);
        
        if (newMessages.length > 0) {
          const lastMsg = newMessages[newMessages.length - 1];
          setLastMessageId(lastMsg.id);
        }
        
        setMessages(newMessages);
        scrollToBottom();
      } else {
        setMessages([]);
        setLastMessageId(null);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please refresh.');
      setMessages([]);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [chatType, chatId, scrollToBottom]);
  
  // ========== FILE UPLOAD HANDLERS ==========
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      showNotification('File too large. Maximum size is 10MB', 'error');
      return;
    }
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-rar-compressed',
      'text/plain'
    ];
    
    const isAllowed = allowedTypes.includes(file.type) || file.type.startsWith('image/');
    
    if (!isAllowed) {
      showNotification('File type not supported. Allowed: Images, PDF, DOC, DOCX, ZIP, TXT', 'error');
      return;
    }
    
    setSelectedFile(file);
    setUploadProgress(0);
    setError(null);
  };
  
  const cancelFileUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // ========== REPLY FUNCTIONS ==========
  const handleReply = useCallback((message) => {
    console.log('📝 Replying to message:', message);
    
    setReplyTo(message.id);
    setReplyToMessage(message);
    
    const senderName = getSenderName(message);
    const messageText = message.message || message.text || '';
    setNewMessage(`@${senderName} ${messageText}`);
    
    setTimeout(() => {
      const input = document.querySelector('.message-input-field');
      if (input) {
        input.focus();
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 100);
    
    document.querySelector('.chat-input-area')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const cancelReply = useCallback(() => {
    setReplyTo(null);
    setReplyToMessage(null);
  }, []);
  
  // ========== SEND MESSAGE - FIXED FOR ROLES ==========
  const sendMessage = async () => {
    console.log('🔵 SEND MESSAGE CALLED');
    console.log('Chat Type:', chatType);
    console.log('Chat ID:', chatId);
    console.log('Current User:', user);
    console.log('User Role:', user?.role);
    console.log('Message:', newMessage);
    console.log('Selected File:', selectedFile?.name);
    console.log('Replying to:', replyTo);
    
    const hasMessage = newMessage?.trim() && newMessage.trim().length > 0;
    const hasFile = selectedFile !== null;
    
    if (!hasMessage && !hasFile) {
      console.log('No message or file to send');
      setError('Please enter a message or attach a file');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!chatId) {
      console.error('No chat ID selected!');
      setError('No chat selected. Please try again.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setSending(true);
    setError(null);
    
    const tempId = Date.now() + Math.random() * 1000;
    const messageText = newMessage?.trim() || '';
    const finalMessage = messageText.replace(/^@[^\s]+\s/, '') || (selectedFile ? `📎 ${selectedFile.name}` : '');
    
    const tempMessage = {
      id: tempId,
      sender_id: user?.id,
      user_id: user?.id,
      sender_name: user?.name || 'You',
      user_name: user?.name || 'You',
      message: messageText,
      text: messageText,
      type: selectedFile ? 'file' : 'text',
      file_url: null,
      file_name: selectedFile?.name || null,
      file_type: selectedFile?.type || null,
      created_at: new Date().toISOString(),
      is_read: false,
      is_own: true,
      is_temp: true,
      reply_to: replyTo,
      reply_to_message: replyToMessage
    };
    
    // IMMEDIATELY append message to UI
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setReplyTo(null);
    setReplyToMessage(null);
    
    scrollToBottom();
    
    try {
      let response;
      
      // ============================================
      // PRIVATE CHAT - Student ↔ Lecturer
      // ============================================
      if (chatType === 'private') {
        const recipientId = parseInt(chatId);
        
        console.log('📤 Sending PRIVATE message');
        console.log('👤 Recipient ID:', recipientId);
        console.log('👤 Current User ID:', user?.id);
        console.log('👤 Current User Role:', user?.role);
        
        if (recipientId === user?.id) {
          setError('You cannot send a message to yourself.');
          setSending(false);
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
          return;
        }
        
        if (isNaN(recipientId) || recipientId <= 0) {
          setError('Invalid recipient selected.');
          setSending(false);
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
          return;
        }
        
        console.log('📦 Sending to recipient ID:', recipientId);
        
        if (selectedFile) {
          const formData = new FormData();
          formData.append('receiver_id', recipientId);
          formData.append('message', finalMessage);
          formData.append('file', selectedFile);
          if (replyTo) {
            formData.append('reply_to', replyTo);
          }
          response = await api.post('/chat/private/send', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const payload = {
            receiver_id: recipientId,
            message: finalMessage
          };
          if (replyTo) {
            payload.reply_to = replyTo;
          }
          
          console.log('📦 Payload being sent:', payload);
          response = await api.post('/chat/private/send', payload);
        }
        
        console.log('📡 Server response:', response.data);
      } 
      // ============================================
      // GROUP CHAT - Admin can join/observe
      // ============================================
      else if (chatType === 'group') {
        const groupId = parseInt(chatId);
        if (isNaN(groupId) || groupId <= 0) {
          setError('Invalid group selected.');
          setSending(false);
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
          return;
        }
        
        console.log('📤 Sending GROUP message to:', groupId);
        
        if (selectedFile) {
          const formData = new FormData();
          formData.append('group_id', groupId);
          formData.append('message', finalMessage);
          formData.append('file', selectedFile);
          if (replyTo) {
            formData.append('reply_to', replyTo);
          }
          response = await api.post('/chat/group/send', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const payload = {
            group_id: groupId,
            message: finalMessage
          };
          if (replyTo) {
            payload.reply_to = replyTo;
          }
          response = await api.post('/chat/group/send', payload);
        }
      } 
      // ============================================
      // COURSE CHAT - Everyone in course
      // ============================================
      else if (chatType === 'course') {
        const courseId = parseInt(chatId);
        if (isNaN(courseId) || courseId <= 0) {
          setError('Invalid course selected.');
          setSending(false);
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
          return;
        }
        
        console.log('📤 Sending COURSE message to:', courseId);
        console.log('📌 This message will be seen by: Students, Lecturers, and Admins in this course');
        
        if (selectedFile) {
          const formData = new FormData();
          formData.append('course_id', courseId);
          formData.append('message', finalMessage);
          formData.append('file', selectedFile);
          if (replyTo) {
            formData.append('reply_to', replyTo);
          }
          response = await api.post('/chat/course/send', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          const payload = {
            course_id: courseId,
            message: finalMessage
          };
          if (replyTo) {
            payload.reply_to = replyTo;
          }
          response = await api.post('/chat/course/send', payload);
        }
      } else {
        throw new Error('Invalid chat type: ' + chatType);
      }
      
      console.log('📡 Server response:', response.data);
      
      if (response.data && response.data.success !== false) {
        console.log('✅ Message sent successfully!');
        
        const serverMessage = response.data.data || {};
        
        const realMessage = {
          id: serverMessage.id || Date.now() + Math.random() * 1000,
          sender_id: user?.id,
          user_id: user?.id,
          sender_name: user?.name || 'You',
          user_name: user?.name || 'You',
          message: serverMessage.message || messageText,
          text: serverMessage.message || messageText,
          type: serverMessage.type || 'text',
          file_url: serverMessage.file_url || null,
          file_name: serverMessage.file_name || null,
          file_type: serverMessage.file_type || null,
          created_at: serverMessage.created_at || new Date().toISOString(),
          is_read: false,
          is_own: true,
          is_temp: false,
          reply_to: replyTo || null
        };
        
        setMessages(prev => 
          prev.map(msg => msg.id === tempId ? realMessage : msg)
        );
        
        setTimeout(async () => {
          await loadMessages();
        }, 500);
        
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        throw new Error(response.data?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ ERROR SENDING MESSAGE:', error);
      
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      let errorMsg = 'Failed to send message. ';
      
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0];
          errorMsg = Array.isArray(firstError) ? firstError[0] : validationErrors.message || 'Invalid data.';
        } else {
          errorMsg = error.response?.data?.message || 'Please check your message.';
        }
      } else if (error.response?.status === 401) {
        errorMsg = 'Session expired. Please refresh the page.';
      } else if (error.response?.status === 403) {
        errorMsg = 'You do not have permission to send messages here.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      setError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setSending(false);
    }
  };
  
  // ========== LOAD PARTICIPANTS ==========
  const loadParticipantsOnce = useCallback(async () => {
    if (!chatId || !isMounted.current) return;
    
    try {
      let response;
      
      if (chatType === 'private') {
        response = await api.get(`/chat/private/${chatId}/participant`);
      } else if (chatType === 'group') {
        response = await api.get(`/chat/group/${chatId}/members`);
      } else if (chatType === 'course') {
        response = await api.get(`/chat/course/${chatId}/students`);
      } else {
        return;
      }
      
      if (response.data && response.data.success !== false && isMounted.current) {
        let participantsList = [];
        
        if (chatType === 'private') {
          const participant = response.data.data;
          // Check if participant is admin, if yes, show admin badge
          participantsList = [{
            ...participant,
            is_admin: participant.role === 'admin'
          }];
        } else {
          const members = response.data.data?.admins || response.data.data?.members || response.data.data || [];
          participantsList = members.map(m => ({
            ...m,
            is_admin: m.role === 'admin'
          }));
        }
        
        setParticipants(participantsList);
        
        // Check if admin is visible
        const adminExists = participantsList.some(p => p.is_admin || p.role === 'admin');
        setIsAdminVisible(adminExists);
        
        console.log('👥 Participants loaded:', participantsList);
        console.log('👤 Admin visible:', adminExists);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
    }
  }, [chatType, chatId]);
  
  // ========== LOAD ONLINE USERS ==========
  const loadOnlineUsers = useCallback(async () => {
    if (!chatId || !isMounted.current) return;
    if (chatType === 'private') return;
    
    try {
      let response;
      
      if (chatType === 'group') {
        response = await api.get(`/chat/group/${chatId}/online`);
      } else if (chatType === 'course') {
        response = await api.get(`/chat/course/${chatId}/online`);
      } else {
        return;
      }
      
      if (response.data && response.data.success !== false && isMounted.current) {
        const count = response.data.count || response.data.online_count || 1;
        setOnlineUsers(count);
      }
    } catch (error) {
      console.error('Error loading online users:', error);
      setOnlineUsers(1);
    }
  }, [chatType, chatId]);
  
  // ========== WEBSOCKET SETUP ==========
  const setupWebSocket = useCallback(async () => {
    if (!chatId) return;
    if (chatType !== 'course' && chatType !== 'group') {
      if (chatType === 'course') startPolling();
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      if (chatType === 'course') startPolling();
      return;
    }
    
    try {
      console.log('Setting up WebSocket for:', chatType, chatId);
      
      if (!echoInstance.current) {
        echoInstance.current = await initWebSocket(token);
      }
      
      const echo = echoInstance.current;
      if (!echo) {
        if (chatType === 'course') startPolling();
        return;
      }
      
      safeCleanupChannel();
      
      const channelName = `${chatType}.${chatId}`;
      const eventName = chatType === 'course' ? 'NewCourseMessage' : 'NewGroupMessage';
      
      console.log('Subscribing to real-time channel:', channelName);
      
      currentChannelName.current = channelName;
      
      try {
        currentChannel.current = echo.channel(channelName);
      } catch (channelError) {
        console.warn('Error creating channel:', channelError);
        currentChannel.current = null;
        if (chatType === 'course') startPolling();
        return;
      }
      
      if (currentChannel.current) {
        try {
          currentChannel.current.listen(eventName, (data) => {
            console.log('📨 REAL-TIME message received via WebSocket:', data);
            
            // Check if sender is admin
            const isAdminSender = data.user_role === 'admin' || data.role === 'admin';
            
            const newMsg = {
              id: data.id || Date.now() + Math.random() * 1000,
              message: data.message,
              text: data.message,
              user_id: data.user_id || data.sender_id,
              user_name: data.user_name || data.sender_name,
              sender_id: data.user_id || data.sender_id,
              sender_name: data.user_name || data.sender_name,
              sender_role: data.user_role || data.role || 'student',
              created_at: data.created_at || new Date().toISOString(),
              file_url: data.file_url,
              file_name: data.file_name,
              file_type: data.file_type,
              type: data.type || 'text',
              is_read: false,
              is_own: data.sender_id === user?.id,
              is_admin: isAdminSender,
              reply_to: data.reply_to || null
            };
            
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMsg.id);
              if (exists) return prev;
              console.log('✅ Adding new message via WebSocket');
              console.log('👤 Sender role:', newMsg.sender_role);
              console.log('👑 Is Admin:', newMsg.is_admin);
              setLastMessageId(newMsg.id);
              return [...prev, newMsg];
            });
            scrollToBottom();
          });
          
          console.log('✅ WebSocket listener set up successfully');
          setIsConnected(true);
          setReconnecting(false);
          reconnectAttempts.current = 0;
          
          if (chatType === 'course') {
            stopPolling();
          }
        } catch (listenError) {
          console.warn('Error setting up listener:', listenError);
          if (chatType === 'course') startPolling();
        }
      }
      
      if (echo.connector && echo.connector.socket) {
        try {
          echo.connector.socket.on('connect', () => {
            console.log('✅ WebSocket connected!');
            setIsConnected(true);
            setReconnecting(false);
            reconnectAttempts.current = 0;
            if (chatType === 'course') stopPolling();
          });
          
          echo.connector.socket.on('disconnect', (reason) => {
            console.log('⚠️ WebSocket disconnected:', reason);
            setIsConnected(false);
            if (chatType === 'course') startPolling();
          });
        } catch (socketError) {
          console.warn('Error setting up socket handlers:', socketError);
        }
      }
      
    } catch (error) {
      console.error('WebSocket setup error:', error);
      setIsConnected(false);
      if (chatType === 'course') startPolling();
    }
  }, [chatId, chatType, scrollToBottom, safeCleanupChannel, startPolling, stopPolling]);
  
  // ========== WEBSOCKET RECONNECT LOGIC ==========
  const reconnectWebSocket = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    
    if (reconnectAttempts.current < 5) {
      reconnectAttempts.current++;
      console.log(`Reconnect attempt ${reconnectAttempts.current}/5`);
      setReconnecting(true);
      
      const delay = 3000 * reconnectAttempts.current;
      
      reconnectTimer.current = setTimeout(() => {
        setupWebSocket();
      }, delay);
    } else {
      console.log('Max reconnection attempts reached');
      setReconnecting(false);
      setIsConnected(false);
    }
  }, [setupWebSocket]);
  
  // ========== REFRESH HANDLER ==========
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setLastMessageId(null);
    await loadMessages();
    await loadParticipantsOnce();
    await loadOnlineUsers();
    setLoading(false);
  };
  
  // ========== FORMAT HELPERS ==========
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
  
  const getMessageText = (msg) => {
    if (msg.message) return msg.message;
    if (msg.text) return msg.text;
    if (msg.decrypted_message) return msg.decrypted_message;
    return '';
  };
  
  const isOwnMessage = (msg) => {
    return msg.user_id === user?.id || msg.sender_id === user?.id || msg.is_own === true;
  };
  
  const getSenderName = (msg) => {
    if (msg.user?.name) return msg.user.name;
    if (msg.sender_name) return msg.sender_name;
    if (msg.user_name) return msg.user_name;
    if (msg.sender?.name) return msg.sender.name;
    return isOwnMessage(msg) ? 'You' : 'User';
  };
  
  const isAdminSender = (msg) => {
    return msg.is_admin === true || msg.sender_role === 'admin' || msg.role === 'admin';
  };
  
  const getChatIcon = () => {
    if (chatType === 'private') {
      // Check if recipient is admin
      const isAdminRecipient = participants.some(p => p.role === 'admin');
      return isAdminRecipient ? <AlertCircle size={16} /> : <Lock size={16} />;
    }
    if (chatType === 'group') return <Users size={16} />;
    if (chatType === 'course') return <Globe size={16} />;
    return <MessageCircle size={16} />;
  };
  
  const getChatSubtitle = () => {
    if (chatType === 'private') {
      const recipient = participants[0];
      if (recipient?.role === 'admin') {
        return '🔑 Admin Chat - Private';
      }
      return '🔒 Private Chat';
    }
    if (chatType === 'course') {
      return '📚 Course Chat - Everyone can see';
    }
    if (chatType === 'group') {
      return '👥 Group Chat';
    }
    return '';
  };
  
  // ========== MAIN INITIALIZATION EFFECT ==========
  useEffect(() => {
    if (!chatId) return;
    
    console.log('🚀 Initializing chat for:', chatType, chatId);
    console.log('👤 User role:', user?.role);
    isMounted.current = true;
    
    const initializeChat = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await loadMessages();
        await loadParticipantsOnce();
        await loadOnlineUsers();
        
        if (chatType !== 'private') {
          await setupWebSocket();
        }
        
        if (chatType === 'course' && !isConnected) {
          console.log('📡 Starting polling as backup');
          startPolling();
        }
      } catch (initError) {
        console.error('Initialization error:', initError);
        setError('Failed to initialize chat. Please refresh.');
        if (chatType === 'course') startPolling();
      } finally {
        setLoading(false);
        hasInitialized.current = true;
      }
    };
    
    initializeChat();
    
    return () => {
      console.log('🧹 Cleaning up chat for:', chatType, chatId);
      isMounted.current = false;
      
      stopPolling();
      
      try {
        safeCleanupChannel();
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
      
      currentChannel.current = null;
      currentChannelName.current = null;
      pollingActive.current = false;
      
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      
      reconnectAttempts.current = 0;
      setIsConnected(false);
      setReconnecting(false);
      hasInitialized.current = false;
      
      console.log('✅ Chat cleanup completed');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, chatType]);
  
  // ========== WATCH CONNECTION ==========
  useEffect(() => {
    if (!isConnected && !reconnecting && !loading && chatType !== 'private' && chatId && hasInitialized.current) {
      const timer = setTimeout(() => {
        console.log('Connection lost, attempting to reconnect WebSocket...');
        setupWebSocket();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, reconnecting, loading, chatType, chatId, setupWebSocket]);
  
  const messageGroups = groupMessagesByDate();
  
  // ========== RENDER ==========
  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" style={{ color: colors.textSecondary }} />
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }
  
  const isSendDisabled = sending || (!newMessage?.trim() && !selectedFile);
  
  return (
    <div className="live-chat-container" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="chat-header" style={{ borderColor: colors.border, backgroundColor: '#ffffff' }}>
        <div className="chat-header-info">
          <div className="chat-icon" style={{ backgroundColor: `${colors.primary}20` }}>
            {getChatIcon()}
          </div>
          <div>
            <h3 className="chat-title" style={{ color: colors.textPrimary }}>{chatName}</h3>
            <div className="chat-status">
              {isConnected ? (
                <Wifi size={12} className="status-online" />
              ) : (
                <WifiOff size={12} className="status-offline" />
              )}
              <span className="status-text" style={{ color: isConnected ? colors.success : colors.warning }}>
                {isConnected ? '🔴 Real-time' : pollingActive.current ? '🟡 Live (Polling)' : '⚪ Connecting...'}
              </span>
              <span className="chat-stats" style={{ color: colors.textSecondary }}>
                • {chatType !== 'private' && `${onlineUsers} online • `}{messages.length} messages
              </span>
            </div>
            <div className="chat-subtitle" style={{ fontSize: '10px', color: colors.textSubtle }}>
              {getChatSubtitle()}
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <button 
            onClick={handleRefresh}
            className="action-btn"
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} style={{ color: colors.primary }} />
          </button>
          <button 
            onClick={() => setShowParticipants(!showParticipants)}
            className="action-btn"
            title="Participants"
          >
            <Users size={16} style={{ color: colors.primary }} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="action-btn close-btn"
              title="Close"
            >
              <X size={18} style={{ color: colors.error }} />
            </button>
          )}
        </div>
      </div>
      
      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="participants-sidebar" style={{ borderColor: colors.border, backgroundColor: `${colors.primary}05` }}>
          <div className="participants-header">
            <h4 style={{ color: colors.textPrimary }}>Participants ({participants.length})</h4>
            <button onClick={() => setShowParticipants(false)}><X size={14} style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="participants-list">
            {participants.length === 0 ? (
              <p className="no-participants">No participants found</p>
            ) : (
              participants.map((p, idx) => (
                <div key={idx} className="participant-item" style={{ backgroundColor: `${colors.primary}10` }}>
                  <div className={`participant-status ${p.is_online !== false ? 'online' : 'offline'}`} />
                  <span style={{ color: colors.textPrimary }}>{p.name || p.user?.name || 'User'}</span>
                  {p.role === 'admin' && <span className="participant-role admin" style={{ color: colors.error }}>👑 Admin</span>}
                  {p.role === 'lecturer' && <span className="participant-role lecturer" style={{ color: colors.primary }}>📚 Lecturer</span>}
                  {p.role === 'student' && <span className="participant-role student" style={{ color: colors.success }}>🎓 Student</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Admin Warning for Course Chat */}
      {chatType === 'course' && isAdminVisible && user?.role !== 'admin' && (
        <div className="admin-warning" style={{ 
          backgroundColor: `${colors.warning}10`, 
          borderLeft: `3px solid ${colors.warning}`,
          padding: '6px 12px',
          fontSize: '11px',
          color: colors.warning,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={14} />
          <span>Admin is monitoring this chat</span>
        </div>
      )}
      
      {/* Error Banner */}
      {error && (
        <div className="error-banner" style={{ backgroundColor: `${colors.error}10`, color: colors.error }}>
          {error}
          <button onClick={handleRefresh} className="retry-btn">Retry</button>
        </div>
      )}
      
      {/* Messages Container */}
      <div className="messages-container">
        {loading && messages.length === 0 && (
          <div className="loading-spinner">
            <div className="spinner" style={{ borderColor: colors.primary }} />
          </div>
        )}
        
        {!loading && messages.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon" style={{ backgroundColor: `${colors.primary}10` }}>
              <MessageCircle size={32} style={{ color: colors.primary }} />
            </div>
            <p className="empty-text" style={{ color: colors.textSecondary }}>No messages yet. Start the conversation!</p>
            <p className="empty-hint" style={{ color: colors.textSubtle }}>
              {isConnected ? '🔴 Real-time active - messages appear instantly' : '📡 Messages update every 5 seconds'}
            </p>
          </div>
        )}
        
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            <div className="date-divider">
              <span className="date-badge" style={{ backgroundColor: `${colors.primary}10`, color: colors.textSecondary }}>
                {date}
              </span>
            </div>
            {msgs.map((msg) => {
              const ownMessage = isOwnMessage(msg);
              const senderName = getSenderName(msg);
              const messageText = getMessageText(msg);
              const isFileMessage = msg.type === 'file' || msg.file_url;
              const isTemp = msg.is_temp === true;
              const isReplying = replyTo === msg.id;
              const isAdmin = isAdminSender(msg);
              
              console.log('🖥️ Rendering message:', { 
                id: msg.id, 
                message: messageText, 
                sender: senderName,
                own: ownMessage,
                temp: isTemp,
                admin: isAdmin,
                reply_to: msg.reply_to
              });
              
              return (
                <div
                  key={msg.id}
                  className={`message-wrapper ${ownMessage ? 'own-message' : 'other-message'} ${isTemp ? 'temp-message' : ''}`}
                  onClick={() => {
                    if (!ownMessage) {
                      handleReply(msg);
                    }
                  }}
                  style={{ cursor: !ownMessage ? 'pointer' : 'default' }}
                >
                  <div
                    className={`message-bubble ${ownMessage ? 'own' : 'other'} ${isReplying ? 'replying' : ''} ${isAdmin ? 'admin-message' : ''}`}
                    style={{
                      backgroundColor: ownMessage ? (isAdmin ? '#dc2626' : '#1a1a2e') : (isAdmin ? '#fef2f2' : '#e3f2fd'),
                      color: ownMessage ? '#ffffff' : (isAdmin ? '#dc2626' : '#1a1a2e'),
                      opacity: isTemp ? 0.7 : 1,
                      border: isReplying ? `2px solid ${colors.primary}` : 'none',
                      borderColor: isAdmin ? '#dc2626' : colors.primary,
                    }}
                  >
                    {/* Reply indicator */}
                    {isReplying && (
                      <div className="reply-indicator" style={{ 
                        fontSize: '10px', 
                        color: colors.primary,
                        marginBottom: '4px',
                        fontWeight: 'bold'
                      }}>
                        ↳ Replying to this message
                      </div>
                    )}
                    
                    {/* Admin Badge */}
                    {isAdmin && (
                      <div className="admin-badge" style={{
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: ownMessage ? '#ffffff' : '#dc2626',
                        backgroundColor: ownMessage ? 'rgba(255,255,255,0.2)' : 'rgba(220,38,38,0.1)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'inline-block',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        👑 Admin
                      </div>
                    )}
                    
                    {/* Reply to indicator */}
                    {msg.reply_to && (
                      <div className="reply-to-indicator" style={{
                        fontSize: '11px',
                        color: ownMessage ? 'rgba(255,255,255,0.6)' : colors.primary,
                        marginBottom: '4px',
                        backgroundColor: ownMessage ? 'rgba(255,255,255,0.1)' : 'rgba(101,158,199,0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        borderLeft: `2px solid ${isAdmin ? '#dc2626' : colors.primary}`
                      }}>
                        <span style={{ fontWeight: '600' }}>
                          ↳ Replying to {msg.reply_to_message?.sender_name || 'a message'}
                        </span>
                      </div>
                    )}
                    
                    {!ownMessage && chatType !== 'private' && (
                      <p className="message-sender" style={{ color: isAdmin ? '#dc2626' : colors.primary }}>
                        {senderName} {isAdmin && '👑'}
                      </p>
                    )}
                    
                    {isFileMessage && msg.file_url ? (
                      <div className="file-attachment">
                        {msg.file_type?.startsWith('image/') || msg.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <div className="image-attachment">
                            <img 
                              src={msg.file_url} 
                              alt="Attachment" 
                              className="chat-image"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(msg.file_url, '_blank');
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="image-error">Failed to load image</div>';
                              }}
                            />
                          </div>
                        ) : (
                          <a 
                            href={msg.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="file-link"
                            style={{ color: ownMessage ? '#ffffff' : colors.primary }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <File size={14} /> {msg.file_name || 'Download file'}
                          </a>
                        )}
                      </div>
                    ) : null}
                    
                    {messageText && (
                      <p className="message-text">{messageText}</p>
                    )}
                    
                    <p className="message-time">
                      {formatTime(msg.created_at)}
                      {isTemp && ' (sending...)'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Reply Preview */}
      {replyToMessage && (
        <div className="reply-preview">
          <div className="reply-preview-content">
            <span className="reply-sender">
              Replying to {replyToMessage.sender_name || replyToMessage.user_name || 'User'}
            </span>
            <p className="reply-text">
              {replyToMessage.message || replyToMessage.text || ''}
            </p>
          </div>
          <button 
            onClick={cancelReply}
            className="reply-cancel-btn"
            title="Cancel reply"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* File Preview */}
      {selectedFile && (
        <div className="file-preview" style={{ backgroundColor: `${colors.primary}10` }}>
          <div className="file-preview-content">
            {selectedFile.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="file-preview-thumbnail" />
            ) : (
              <div className="file-preview-icon" style={{ backgroundColor: `${colors.primary}20` }}>
                <File size={20} style={{ color: colors.primary }} />
              </div>
            )}
            <div className="file-preview-info">
              <p className="file-preview-name" style={{ color: colors.textPrimary }}>{selectedFile.name}</p>
              <p className="file-preview-size" style={{ color: colors.textSecondary }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
              {uploadProgress > 0 && (
                <div className="upload-progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%`, backgroundColor: colors.primary }} />
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={cancelFileUpload}
            className="file-preview-cancel"
            disabled={sending}
          >
            <X size={16} style={{ color: colors.error }} />
          </button>
        </div>
      )}
      
      {/* Input Area */}
      <div className="chat-input-area" style={{ borderColor: colors.border, backgroundColor: '#ffffff' }}>
        <div className="input-wrapper">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden-file-input" 
            onChange={handleFileSelect} 
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip,text/plain" 
          />
          <button 
            className="attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
            disabled={sending}
          >
            <Paperclip size={18} style={{ color: !isConnected ? colors.textSubtle : colors.textSecondary }} />
          </button>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isSendDisabled) {
                  sendMessage();
                }
              }
            }}
            placeholder={`Type a message to ${chatName}...`}
            rows={1}
            className="message-input-field"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            disabled={sending}
            autoFocus
          />
          
          <button
            onClick={sendMessage}
            disabled={isSendDisabled}
            className="send-btn"
            style={{
              backgroundColor: isSendDisabled ? colors.border : colors.primary,
              color: isSendDisabled ? colors.textSubtle : '#ffffff',
              cursor: isSendDisabled ? 'not-allowed' : 'pointer',
              opacity: isSendDisabled ? 0.6 : 1,
            }}
            title={isSendDisabled ? 'Type a message or attach a file' : 'Send message'}
          >
            {sending ? (
              <div className="send-spinner" style={{ borderColor: '#ffffff', borderTopColor: 'transparent' }} />
            ) : (
              <Send size={18} color={isSendDisabled ? colors.textSubtle : '#ffffff'} />
            )}
          </button>
        </div>
        
        <div className="input-footer">
          <div className="footer-left">
            <span className="footer-badge" style={{ color: colors.textSubtle }}>
              {chatType === 'private' ? '🔒 Private' : '🌐 Live'}
            </span>
            {chatType !== 'private' && (
              <span className="footer-badge" style={{ color: colors.textSubtle }}>
                • {onlineUsers} online
              </span>
            )}
            {isConnected && (
              <span className="footer-badge online-badge" style={{ color: colors.success }}>
                • Real-time 🟢
              </span>
            )}
            {pollingActive.current && !isConnected && (
              <span className="footer-badge" style={{ color: colors.warning }}>
                • Polling 📡
              </span>
            )}
            {isAdminVisible && user?.role !== 'admin' && (
              <span className="footer-badge" style={{ color: colors.warning }}>
                • 👑 Admin monitoring
              </span>
            )}
          </div>
          <div className="footer-right">
            <span className="footer-badge" style={{ color: colors.textSubtle }}>
              <Users size={10} className="inline-icon" /> {participants.length} participants
            </span>
            <span className="footer-badge" style={{ color: colors.textSubtle }}>
              • Click any message to reply
            </span>
            <span className="footer-badge" style={{ color: colors.textSubtle }}>
              • Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;