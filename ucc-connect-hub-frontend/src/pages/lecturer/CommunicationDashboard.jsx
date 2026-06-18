import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import io from 'socket.io-client';
import { 
  MessageCircle, Bell, Video, Users, Send, Plus, Search, 
  FileText, Download, Eye, Calendar, Clock, Mic, Phone, 
  Mail, Share2, X, Check, AlertCircle, Paperclip, 
  Image, Smile, MoreVertical, Trash2, Edit, Reply,
  Link2, QrCode, Copy, Globe, Lock, UserPlus, UserMinus,
  Volume2, VolumeX, Camera, ScreenShare, Settings
} from 'lucide-react';

const CommunicationDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  // State management
  const [activeChat, setActiveChat] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // chat, announcements, rooms
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [virtualRooms, setVirtualRooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // New state for forms
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    course_id: '',
    priority: 'medium',
    send_sms: false,
    send_email: false
  });
  
  const [newRoom, setNewRoom] = useState({
    title: '',
    description: '',
    course_id: '',
    start_time: '',
    end_time: '',
    max_participants: 50,
    is_public: true
  });
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    course_id: '',
    is_private: false
  });
  
  const [attachment, setAttachment] = useState(null);
  
  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // ==================== SOCKET.IO CONNECTION ====================
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3002', {
      auth: { token: localStorage.getItem('token') }
    });
    
    setSocket(newSocket);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('user-online', { user_id: user?.id, name: user?.name, role: 'lecturer' });
    });
    
    newSocket.on('new-message', (data) => {
      if (activeChat?.id === data.chat_id || activeChat?.type === data.chat_type) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }
      showNotificationMessage(`${data.sender_name}: ${data.message.substring(0, 50)}...`, 'info');
    });
    
    newSocket.on('user-typing', (data) => {
      if (data.is_typing) {
        setTypingUsers(prev => [...prev, data.user_name]);
      } else {
        setTypingUsers(prev => prev.filter(name => name !== data.user_name));
      }
    });
    
    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);
  
  // ==================== FETCH DATA ====================
  useEffect(() => {
    fetchCourses();
    fetchAnnouncements();
    fetchVirtualRooms();
    fetchGroups();
  }, []);
  
  const fetchCourses = async () => {
    try {
      const response = await api.get('/lecturer/courses');
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        setCourses([
          { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45 },
          { id: 2, title: 'Database Systems', code: 'CS302', students: 38 },
          { id: 3, title: 'Data Structures', code: 'CS301', students: 42 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements/lecturer');
      if (response.data.success) {
        setAnnouncements(response.data.data);
      } else {
        setAnnouncements([
          { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will start on April 15th. Please check the timetable.', course: 'All Courses', date: '2025-03-18', priority: 'high', recipients: 125, sent_sms: true },
          { id: 2, title: 'Assignment Extension', content: 'React.js project deadline extended to March 28th.', course: 'Web Development', date: '2025-03-17', priority: 'medium', recipients: 45, sent_sms: false },
          { id: 3, title: 'Guest Lecture', content: 'Special guest lecture on AI this Friday at 2 PM.', course: 'All Courses', date: '2025-03-15', priority: 'low', recipients: 125, sent_sms: true }
        ]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  
  const fetchVirtualRooms = async () => {
    try {
      const response = await api.get('/virtual-rooms/lecturer');
      if (response.data.success) {
        setVirtualRooms(response.data.data);
      } else {
        setVirtualRooms([
          { id: 1, title: 'Web Development Lecture', course: 'Advanced Web Development', startTime: 'Today, 2:00 PM', endTime: '4:00 PM', participants: 12, maxParticipants: 50, status: 'active', joinUrl: 'https://meet.google.com/abc-defg-hij' },
          { id: 2, title: 'Office Hours', course: 'Database Systems', startTime: 'Tomorrow, 10:00 AM', endTime: '12:00 PM', participants: 0, maxParticipants: 50, status: 'scheduled', joinUrl: null },
          { id: 3, title: 'Q&A Session', course: 'Data Structures', startTime: '2025-03-20, 3:00 PM', endTime: '5:00 PM', participants: 0, maxParticipants: 50, status: 'scheduled', joinUrl: null }
        ]);
      }
    } catch (error) {
      console.error('Error fetching virtual rooms:', error);
    }
  };
  
  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups/lecturer');
      if (response.data.success) {
        setGroups(response.data.data);
      } else {
        setGroups([
          { id: 1, name: 'Web Dev Study Group', course: 'Advanced Web Development', members: 12, unread: 3, lastMessage: 'Great session today!' },
          { id: 2, name: 'Database Project Team', course: 'Database Systems', members: 8, unread: 0, lastMessage: 'Meeting at 2 PM' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };
  
  const fetchMessages = async (chatId, chatType) => {
    setLoading(true);
    try {
      let response;
      if (chatType === 'group') {
        response = await api.get(`/chat/group/${chatId}`);
      } else if (chatType === 'course') {
        response = await api.get(`/chat/course/${chatId}`);
      } else {
        response = await api.get(`/chat/private/${chatId}`);
      }
      
      if (response.data.success) {
        setMessages(response.data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Load sample messages
      setMessages([
        { id: 1, sender_name: 'John Doe', sender_role: 'student', message: 'Professor, I have a question about the assignment', time: '10:30 AM', is_lecturer: false },
        { id: 2, sender_name: 'Jane Smith', sender_role: 'student', message: 'When is the deadline?', time: '10:32 AM', is_lecturer: false },
        { id: 3, sender_name: user?.name, sender_role: 'lecturer', message: 'The deadline is March 25th', time: '10:35 AM', is_lecturer: true }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // ==================== CHAT FUNCTIONS ====================
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    fetchMessages(chat.id, chat.type);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() && !attachment) return;
    
    setLoading(true);
    try {
      let response;
      const formData = new FormData();
      formData.append('message', message);
      formData.append('chat_id', activeChat.id);
      formData.append('chat_type', activeChat.type);
      
      if (attachment) {
        formData.append('file', attachment);
      }
      
      if (activeChat.type === 'group') {
        response = await api.post('/chat/group/send', formData);
      } else if (activeChat.type === 'course') {
        response = await api.post('/chat/course/send', formData);
      } else {
        response = await api.post('/chat/private/send', formData);
      }
      
      if (response.data.success) {
        const newMessage = {
          id: response.data.id,
          sender_name: user?.name,
          sender_role: 'lecturer',
          message: message,
          time: new Date().toLocaleTimeString(),
          is_lecturer: true,
          attachment: attachment ? attachment.name : null
        };
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setAttachment(null);
        scrollToBottom();
        
        // Emit via socket
        if (socket) {
          socket.emit('send-message', {
            chat_id: activeChat.id,
            chat_type: activeChat.type,
            message: message,
            sender_id: user?.id,
            sender_name: user?.name
          });
        }
      }
    } catch (error) {
      showNotificationMessage('Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing', {
        chat_id: activeChat?.id,
        chat_type: activeChat?.type,
        is_typing: true
      });
      
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          chat_id: activeChat?.id,
          chat_type: activeChat?.type,
          is_typing: false
        });
      }, 1000);
      setTypingTimeout(timeout);
    }
  };
  
  const handleFileAttachment = () => {
    fileInputRef.current.click();
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotificationMessage('File too large. Max 10MB', 'error');
        return;
      }
      setAttachment(file);
      setShowAttachment(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // ==================== ANNOUNCEMENT FUNCTIONS ====================
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showNotificationMessage('Please fill in title and content', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/announcements', {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        course_id: newAnnouncement.course_id || null,
        priority: newAnnouncement.priority,
        send_sms: newAnnouncement.send_sms,
        send_email: newAnnouncement.send_email
      });
      
      if (response.data.success) {
        showNotificationMessage('Announcement posted successfully!', 'success');
        setShowCreateAnnouncement(false);
        setNewAnnouncement({
          title: '', content: '', course_id: '', priority: 'medium', send_sms: false, send_email: false
        });
        fetchAnnouncements();
        
        // Send push notifications
        if (newAnnouncement.send_sms) {
          await api.post('/notifications/sms-broadcast', {
            course_id: newAnnouncement.course_id,
            message: `${newAnnouncement.title}: ${newAnnouncement.content.substring(0, 100)}`
          });
        }
      }
    } catch (error) {
      showNotificationMessage('Failed to post announcement', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // ==================== VIRTUAL ROOM FUNCTIONS ====================
  const handleCreateRoom = async () => {
    if (!newRoom.title || !newRoom.course_id || !newRoom.start_time) {
      showNotificationMessage('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/virtual-rooms', {
        title: newRoom.title,
        description: newRoom.description,
        course_id: newRoom.course_id,
        start_time: newRoom.start_time,
        end_time: newRoom.end_time,
        max_participants: newRoom.max_participants,
        is_public: newRoom.is_public
      });
      
      if (response.data.success) {
        showNotificationMessage(`Virtual room "${newRoom.title}" created!`, 'success');
        setShowCreateRoom(false);
        setNewRoom({
          title: '', description: '', course_id: '', start_time: '', end_time: '', max_participants: 50, is_public: true
        });
        fetchVirtualRooms();
        
        // Notify students
        await api.post('/notifications/send-to-course', {
          course_id: newRoom.course_id,
          title: 'New Virtual Room',
          message: `Virtual room "${newRoom.title}" has been scheduled for ${new Date(newRoom.start_time).toLocaleString()}`
        });
      }
    } catch (error) {
      showNotificationMessage('Failed to create virtual room', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinRoom = async (room) => {
    try {
      const response = await api.post(`/virtual-rooms/${room.id}/join`);
      if (response.data.success && response.data.join_url) {
        window.open(response.data.join_url, '_blank');
        showNotificationMessage(`Joining ${room.title}...`, 'info');
      } else {
        showNotificationMessage('Room is not ready yet. Please check the start time.', 'error');
      }
    } catch (error) {
      showNotificationMessage('Failed to join virtual room', 'error');
    }
  };
  
  // ==================== GROUP FUNCTIONS ====================
  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.course_id) {
      showNotificationMessage('Please fill in group name and select a course', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/groups', {
        name: newGroup.name,
        description: newGroup.description,
        course_id: newGroup.course_id,
        is_private: newGroup.is_private
      });
      
      if (response.data.success) {
        showNotificationMessage(`Group "${newGroup.name}" created!`, 'success');
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '', course_id: '', is_private: false });
        fetchGroups();
      }
    } catch (error) {
      showNotificationMessage('Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // ==================== RENDER COMPONENTS ====================
  const renderChatList = () => (
    <div className="glass-card p-4 h-full overflow-y-auto" style={{ border: `1px solid ${colors.border}` }}>
      <h3 className="font-bold mb-3" style={{ color: colors.textPrimary }}>Course Groups</h3>
      {groups.map(group => (
        <div key={group.id} onClick={() => handleSelectChat({ id: group.id, name: group.name, type: 'group', course: group.course })}
          className={`p-3 rounded-lg cursor-pointer mb-2 transition-all hover:scale-102 ${activeChat?.id === group.id ? 'ring-2' : ''}`}
          style={{ backgroundColor: `${colors.primary}05`, ringColor: colors.primary }}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium" style={{ color: colors.textPrimary }}>{group.name}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>{group.course} • {group.members} members</div>
            </div>
            {group.unread > 0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: colors.primary, color: '#000' }}>{group.unread}</span>}
          </div>
          <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>{group.lastMessage}</p>
        </div>
      ))}
      
      <h3 className="font-bold mt-4 mb-3" style={{ color: colors.textPrimary }}>Course Chats</h3>
      {courses.map(course => (
        <div key={course.id} onClick={() => handleSelectChat({ id: course.id, name: course.title, type: 'course', code: course.code })}
          className={`p-3 rounded-lg cursor-pointer mb-2 transition-all hover:scale-102 ${activeChat?.id === course.id ? 'ring-2' : ''}`}
          style={{ backgroundColor: `${colors.secondary}05`, ringColor: colors.secondary }}>
          <div className="font-medium" style={{ color: colors.textPrimary }}>{course.title}</div>
          <div className="text-xs" style={{ color: colors.textSecondary }}>{course.code} • {course.students} students</div>
        </div>
      ))}
      
      <button onClick={() => setShowCreateGroup(true)} className="w-full mt-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}>
        <Plus size={14} /> Create New Group
      </button>
    </div>
  );
  
  const renderChatWindow = () => {
    if (!activeChat) {
      return (
        <div className="glass-card p-6 h-full flex items-center justify-center" style={{ border: `1px solid ${colors.border}` }}>
          <div className="text-center">
            <MessageCircle size={48} style={{ color: colors.primary }} className="mx-auto mb-3" />
            <p style={{ color: colors.textSecondary }}>Select a chat to start messaging</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="glass-card" style={{ border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Chat Header */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold" style={{ color: colors.textPrimary }}>{activeChat.name}</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>{activeChat.type === 'group' ? activeChat.course : activeChat.code} • {onlineUsers.length} online</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAttachment(true)} className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}><Paperclip size={16} /></button>
              <button className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}><Settings size={16} /></button>
            </div>
          </div>
          {typingUsers.length > 0 && (
            <div className="text-xs mt-2" style={{ color: colors.primary }}>{typingUsers.join(', ')} is typing...</div>
          )}
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: '400px' }}>
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.sender_role === 'lecturer' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender_role === 'lecturer' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                style={{ backgroundColor: msg.sender_role === 'lecturer' ? colors.primary : `${colors.primary}10`, color: msg.sender_role === 'lecturer' ? '#000' : colors.textPrimary }}>
                {msg.sender_role !== 'lecturer' && (
                  <div className="text-xs font-semibold mb-1" style={{ color: colors.primary }}>{msg.sender_name}</div>
                )}
                <p className="text-sm">{msg.message}</p>
                {msg.attachment && (
                  <div className="mt-2 p-2 rounded text-xs flex items-center gap-2" style={{ backgroundColor: `${colors.background}80` }}>
                    <Paperclip size={12} /> {msg.attachment}
                  </div>
                )}
                <div className="text-xs mt-1 opacity-70">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex gap-2">
            <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-2 rounded-lg border" 
              style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
              value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} onKeyUp={handleTyping} />
            {attachment && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <Paperclip size={12} /> {attachment.name}
                <button onClick={() => setAttachment(null)}><X size={12} /></button>
              </div>
            )}
            <button onClick={handleSendMessage} className="px-4 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAnnouncementsSection = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2>
        <button onClick={() => setShowCreateAnnouncement(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>
          <Bell size={16} /> New Announcement
        </button>
      </div>
      
      <div className="space-y-4">
        {announcements.map(announcement => (
          <div key={announcement.id} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-500' : announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                    {announcement.priority}
                  </span>
                  <span className="text-xs" style={{ color: colors.textSubtle }}>{announcement.course}</span>
                </div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>{announcement.title}</h3>
                <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>{announcement.content}</p>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: colors.textSubtle }}>{announcement.date}</div>
                <div className="text-xs mt-1" style={{ color: colors.primary }}>{announcement.recipients} recipients</div>
                {announcement.sent_sms && <div className="text-xs mt-1" style={{ color: '#32CD32' }}>✓ SMS Sent</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderVirtualRoomsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {virtualRooms.map(room => (
        <div key={room.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex items-center gap-3 mb-3">
            <Video size={24} style={{ color: colors.primary }} />
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{room.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ml-auto ${room.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {room.status === 'active' ? 'Live Now' : 'Scheduled'}
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{room.course}</p>
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{room.startTime}</span></div>
            <div className="flex items-center gap-1"><Users size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{room.participants}/{room.maxParticipants}</span></div>
          </div>
          <button onClick={() => handleJoinRoom(room)} className="w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}>
            <Video size={14} /> {room.status === 'active' ? 'Join Now' : 'Schedule Reminder'}
          </button>
        </div>
      ))}
      <button onClick={() => setShowCreateRoom(true)} className="glass-card p-6 flex items-center justify-center gap-2 hover:scale-102 transition-all" style={{ border: `2px dashed ${colors.primary}` }}>
        <Plus size={20} style={{ color: colors.primary }} />
        <span style={{ color: colors.primary }}>Schedule New Virtual Room</span>
      </button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}>
            {notification.type === 'success' && <Check size={20} className="text-white" />}
            {notification.type === 'error' && <AlertCircle size={20} className="text-white" />}
            {notification.type === 'info' && <Bell size={20} className="text-white" />}
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Communication & Collaboration</h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Chat with students, post announcements, and manage virtual rooms</p>
      </motion.div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b" style={{ borderColor: colors.border }}>
        {[
          { id: 'chat', label: 'Live Chat', icon: MessageCircle },
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'rooms', label: 'Virtual Rooms', icon: Video }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`}
            style={{ borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent', color: activeTab === tab.id ? colors.primary : colors.textSecondary }}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>
      
      {/* Chat Section */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 300px)' }}>
          <div className="lg:col-span-1">{renderChatList()}</div>
          <div className="lg:col-span-2">{renderChatWindow()}</div>
        </div>
      )}
      
      {/* Announcements Section */}
      {activeTab === 'announcements' && renderAnnouncementsSection()}
      
      {/* Virtual Rooms Section */}
      {activeTab === 'rooms' && renderVirtualRoomsSection()}
      
      {/* File Input (hidden) */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.jpg,.png,.zip" />
      
      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateAnnouncement(false)}>
          <div className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Announcement</h3>
              <button onClick={() => setShowCreateAnnouncement(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Title *</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Content *</label>
                <textarea rows="4" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Course</label>
                <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={newAnnouncement.course_id} onChange={(e) => setNewAnnouncement({...newAnnouncement, course_id: e.target.value})}>
                  <option value="">All Courses</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Priority</label>
                <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={newAnnouncement.send_sms} onChange={(e) => setNewAnnouncement({...newAnnouncement, send_sms: e.target.checked})} /> Send SMS to students</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={newAnnouncement.send_email} onChange={(e) => setNewAnnouncement({...newAnnouncement, send_email: e.target.checked})} /> Send Email</label>
              </div>
              <button onClick={handleCreateAnnouncement} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
                {loading ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CREATE VIRTUAL ROOM MODAL */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateRoom(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Schedule Virtual Room</h3>
              <button onClick={() => setShowCreateRoom(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Room Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.title} onChange={(e) => setNewRoom({...newRoom, title: e.target.value})} />
              <textarea placeholder="Description" rows="2" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.description} onChange={(e) => setNewRoom({...newRoom, description: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.course_id} onChange={(e) => setNewRoom({...newRoom, course_id: e.target.value})}>
                <option value="">Select Course *</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input type="datetime-local" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.start_time} onChange={(e) => setNewRoom({...newRoom, start_time: e.target.value})} />
              <input type="datetime-local" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.end_time} onChange={(e) => setNewRoom({...newRoom, end_time: e.target.value})} />
              <input type="number" placeholder="Max Participants" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newRoom.max_participants} onChange={(e) => setNewRoom({...newRoom, max_participants: parseInt(e.target.value)})} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={newRoom.is_public} onChange={(e) => setNewRoom({...newRoom, is_public: e.target.checked})} /> Public Room (students can join without invitation)</label>
              <button onClick={handleCreateRoom} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule Room'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CREATE GROUP MODAL */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateGroup(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Study Group</h3>
              <button onClick={() => setShowCreateGroup(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Group Name *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} />
              <textarea placeholder="Description" rows="2" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                value={newGroup.course_id} onChange={(e) => setNewGroup({...newGroup, course_id: e.target.value})}>
                <option value="">Select Course *</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <label className="flex items-center gap-2"><input type="checkbox" checked={newGroup.is_private} onChange={(e) => setNewGroup({...newGroup, is_private: e.target.checked})} /> Private Group (requires approval to join)</label>
              <button onClick={handleCreateGroup} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
                {loading ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationDashboard;