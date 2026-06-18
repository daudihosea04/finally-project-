// src/pages/lecturer/LecturerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  BookOpen, Users, ClipboardList, CheckCircle, Clock, 
  Calendar, MessageCircle, Bell, TrendingUp, Award, 
  FileText, Upload, Edit, Trash2, Eye, Plus, Search,
  Download, Filter, Star, ChevronRight, Settings,
  Video, Share2, Lock, Shield, AlertCircle, Send,
  UserPlus, UserCheck, UserX, BarChart3, Activity,
  FolderOpen, Link2, QrCode, Printer, Save, XCircle,
  RefreshCw, MoreVertical, Mail, Phone, MapPin,
  X, Check, AlertTriangle, LogOut, HelpCircle,
  Globe, Lock as LockIcon
} from 'lucide-react';
import LiveChat from '../../components/LiveChat';

const LecturerDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [virtualRooms, setVirtualRooms] = useState([]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', course_id: '', due_date: '', due_time: '', total_points: 100 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', course_id: '', priority: 'medium' });
  const [newGroup, setNewGroup] = useState({ name: '', description: '', course_id: '' });
  const [newRoom, setNewRoom] = useState({ title: '', course_id: '', start_time: '', end_time: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Chat state variables
  const [showChat, setShowChat] = useState(false);
  const [selectedChatType, setSelectedChatType] = useState('course');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatName, setSelectedChatName] = useState('');
  
  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleHelp = () => {
    showNotificationMessage('Help Center: Contact support@uccconnect.ac.tz or call +255 747 172 018', 'info');
  };

  const handleViewCourse = (courseId, courseTitle) => {
    navigate(`/lecturer/courses/${courseId}`);
  };

  const handleViewStudents = (courseId, courseTitle) => {
    navigate(`/lecturer/courses/${courseId}/students`);
  };

  // ==================== ASSIGNMENT FUNCTIONS ====================
  
  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.course_id || !newAssignment.due_date) {
      showNotificationMessage('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/lecturer/assignments', {
        title: newAssignment.title,
        description: newAssignment.description,
        course_id: parseInt(newAssignment.course_id),
        due_date: `${newAssignment.due_date} ${newAssignment.due_time || '23:59:00'}`,
        total_points: parseInt(newAssignment.total_points),
        created_by: user?.id
      });
      
      if (response.data.success || response.data.assignment) {
        showNotificationMessage('Assignment created successfully! Students will be notified.', 'success');
        setShowCreateAssignment(false);
        setNewAssignment({ title: '', description: '', course_id: '', due_date: '', due_time: '', total_points: 100 });
        loadDashboardData();
        
        try {
          await api.post('/notifications/send', {
            course_id: parseInt(newAssignment.course_id),
            title: 'New Assignment Posted',
            message: `New assignment "${newAssignment.title}" has been posted. Due date: ${newAssignment.due_date}`,
            type: 'assignment'
          });
        } catch (notifError) {
          console.log('Notification not sent:', notifError);
        }
      }
    } catch (error) {
      showNotificationMessage(error.response?.data?.message || 'Failed to create assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssignment = async (assignmentId, assignmentTitle) => {
    try {
      const response = await api.get(`/lecturer/assignments/${assignmentId}`);
      if (response.data.success) {
        const assignment = response.data.data || response.data.assignment;
        showNotificationMessage(`Assignment: ${assignment.title}\nDue: ${assignment.due_date}\nSubmissions: ${assignment.submissions_count || 0}`, 'info');
      }
    } catch (error) {
      showNotificationMessage('Failed to load assignment details', 'error');
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({ grade: submission.grade || '', feedback: submission.feedback || '' });
    setShowGradeModal(true);
  };

  const handleSubmitGrade = async () => {
    if (!gradeData.grade) {
      showNotificationMessage('Please enter a grade', 'error');
      return;
    }
    
    if (gradeData.grade < 0 || gradeData.grade > 100) {
      showNotificationMessage('Grade must be between 0 and 100', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.put(`/lecturer/submissions/${selectedSubmission.id}/grade`, {
        grade: parseInt(gradeData.grade),
        feedback: gradeData.feedback
      });
      
      if (response.data.success) {
        showNotificationMessage(`Graded ${selectedSubmission.student_name || selectedSubmission.student}'s submission: ${gradeData.grade}%`, 'success');
        setShowGradeModal(false);
        setSelectedSubmission(null);
        setGradeData({ grade: '', feedback: '' });
        loadDashboardData();
        
        try {
          await api.post('/notifications/send', {
            user_id: selectedSubmission.user_id,
            title: 'Assignment Graded',
            message: `Your submission for "${selectedSubmission.assignment_title || selectedSubmission.assignment}" has been graded: ${gradeData.grade}%`,
            type: 'grade'
          });
        } catch (notifError) {
          console.log('Notification not sent:', notifError);
        }
      }
    } catch (error) {
      showNotificationMessage('Failed to grade submission', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== ANNOUNCEMENT FUNCTIONS ====================
  
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showNotificationMessage('Please fill in title and content', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/lecturer/announcements', {
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        course_id: newAnnouncement.course_id ? parseInt(newAnnouncement.course_id) : null,
        priority: newAnnouncement.priority,
        created_by: user?.id
      });
      
      if (response.data.success) {
        showNotificationMessage('Announcement posted successfully!', 'success');
        setShowCreateAnnouncement(false);
        setNewAnnouncement({ title: '', content: '', course_id: '', priority: 'medium' });
        loadDashboardData();
        
        try {
          if (newAnnouncement.course_id) {
            await api.post('/notifications/send-to-course', {
              course_id: parseInt(newAnnouncement.course_id),
              title: newAnnouncement.title,
              message: newAnnouncement.content,
              type: 'announcement'
            });
          } else {
            await api.post('/notifications/send-to-all', {
              title: newAnnouncement.title,
              message: newAnnouncement.content,
              type: 'announcement',
              role: 'student'
            });
          }
        } catch (notifError) {
          console.log('Notification not sent:', notifError);
        }
      }
    } catch (error) {
      showNotificationMessage('Failed to post announcement', 'error');
    } finally {
      setLoading(false);
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
      const response = await api.post('/lecturer/groups', {
        name: newGroup.name,
        description: newGroup.description,
        course_id: parseInt(newGroup.course_id),
        created_by: user?.id,
        max_members: 50
      });
      
      if (response.data.success || response.data.group) {
        showNotificationMessage(`Group "${newGroup.name}" created successfully!`, 'success');
        setShowCreateGroup(false);
        setNewGroup({ name: '', description: '', course_id: '' });
        loadDashboardData();
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Group creation error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create group';
      showNotificationMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId, groupName) => {
    setLoading(true);
    try {
      const response = await api.post(`/lecturer/groups/${groupId}/join`);
      if (response.data.success) {
        showNotificationMessage(`Joined ${groupName} successfully!`, 'success');
        loadDashboardData();
        setSelectedChatType('group');
        setSelectedChatId(groupId);
        setSelectedChatName(groupName);
        setShowChat(true);
      } else {
        showNotificationMessage('Failed to join group', 'error');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to join group';
      showNotificationMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== VIRTUAL ROOM FUNCTIONS (COMPLETELY FIXED) ====================

  /**
   * Format date for API - Converts datetime-local to MySQL format
   */
  const formatDateTimeForAPI = (datetime) => {
    if (!datetime) return null;
    try {
      const date = new Date(datetime);
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date detected:', datetime);
        return null;
      }
      // ✅ Ensure year is valid (between 2000 and 2100)
      if (date.getFullYear() < 2000 || date.getFullYear() > 2100) {
        console.warn('⚠️ Invalid year detected:', date.getFullYear());
        return null;
      }
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      console.error('❌ Date formatting error:', e);
      return null;
    }
  };

  /**
   * Handle Create Virtual Room - COMPLETELY FIXED
   */
  const handleCreateRoom = async () => {
    // ✅ Step 1: Validate required fields
    if (!newRoom.title || !newRoom.title.trim()) {
      showNotificationMessage('Please enter a room title', 'error');
      return;
    }
    
    if (!newRoom.course_id) {
      showNotificationMessage('Please select a course', 'error');
      return;
    }
    
    if (!newRoom.start_time) {
      showNotificationMessage('Please select start time', 'error');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Step 2: Format dates properly
      const startTime = formatDateTimeForAPI(newRoom.start_time);
      let endTime = null;
      
      if (newRoom.end_time) {
        endTime = formatDateTimeForAPI(newRoom.end_time);
        // If end_time is invalid, don't send it
        if (!endTime) {
          console.warn('⚠️ Invalid end_time, sending without end_time');
        }
      }
      
      // ✅ Step 3: Validate start_time is valid
      if (!startTime) {
        showNotificationMessage('Invalid start time. Please select a valid date and time.', 'error');
        setLoading(false);
        return;
      }
      
      // ✅ Step 4: Build room data with CORRECT field names
      const roomData = {
        title: newRoom.title.trim(),
        course_id: parseInt(newRoom.course_id), // ✅ MUST be integer
        start_time: startTime,                  // ✅ MUST be 'start_time'
        description: 'Virtual meeting room',
        max_participants: 50
      };
      
      // ✅ Only add end_time if it's valid
      if (endTime) {
        roomData.end_time = endTime;
      }
      
      console.log('📤 Sending room data:', roomData);
      console.log('📤 course_id:', roomData.course_id, 'type:', typeof roomData.course_id);
      console.log('📤 start_time:', roomData.start_time);
      
      // ✅ Step 5: Send the request
      const response = await api.post('/lecturer/virtual-rooms', roomData);
      
      console.log('📥 Response:', response.data);
      
      if (response.data.success) {
        showNotificationMessage(`Virtual room "${newRoom.title}" scheduled successfully!`, 'success');
        setShowCreateRoom(false);
        setNewRoom({ title: '', course_id: '', start_time: '', end_time: '' });
        loadDashboardData();
        
        // Send notification
        try {
          await api.post('/notifications/send-to-course', {
            course_id: parseInt(newRoom.course_id),
            title: 'Virtual Room Scheduled',
            message: `Virtual room "${newRoom.title}" has been scheduled for ${new Date(startTime).toLocaleString()}`,
            type: 'virtual_room'
          });
        } catch (notifError) {
          console.log('Notification not sent:', notifError);
        }
      } else {
        // ✅ Step 6: Handle validation errors
        if (response.data.errors) {
          const errors = Object.values(response.data.errors).flat();
          showNotificationMessage(errors[0] || 'Validation failed', 'error');
        } else {
          showNotificationMessage(response.data.message || 'Failed to create room', 'error');
        }
      }
    } catch (error) {
      console.error('❌ Create room error:', error);
      
      // ✅ Step 7: Detailed error handling
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        console.log('📋 Validation errors:', errors);
        
        if (errors) {
          // Show first validation error
          const firstError = Object.values(errors)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Validation error';
          showNotificationMessage(errorMessage, 'error');
        } else {
          showNotificationMessage('Validation error. Please check all fields.', 'error');
        }
      } else if (error.response?.data?.message) {
        showNotificationMessage(error.response.data.message, 'error');
      } else {
        showNotificationMessage('Failed to schedule virtual room. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId, roomTitle) => {
    try {
      const response = await api.post(`/lecturer/virtual-rooms/${roomId}/join`);
      if (response.data.success && response.data.join_url) {
        window.open(response.data.join_url, '_blank');
        showNotificationMessage(`Joining ${roomTitle}...`, 'info');
      } else {
        showNotificationMessage('Room is not available at this time', 'error');
      }
    } catch (error) {
      showNotificationMessage('Failed to join virtual room', 'error');
    }
  };

  // ==================== REPORT FUNCTIONS ====================
  
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/lecturer/reports/generate', {
        type: 'course_performance',
        format: 'pdf'
      });
      
      if (response.data.success && response.data.download_url) {
        window.open(response.data.download_url, '_blank');
        showNotificationMessage('Report generated successfully!', 'success');
      }
    } catch (error) {
      showNotificationMessage('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportGrades = async (courseId) => {
    setLoading(true);
    try {
      const response = await api.get(`/lecturer/reports/export-grades/${courseId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades_course_${courseId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showNotificationMessage('Grades exported successfully!', 'success');
    } catch (error) {
      showNotificationMessage('Failed to export grades', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SYNC FUNCTIONS ====================
  
  const handleSyncData = async () => {
    showNotificationMessage('Syncing data...', 'info');
    await loadDashboardData();
    showNotificationMessage('Data synced successfully!', 'success');
  };

  // ==================== FETCH DATA ====================
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const coursesRes = await api.get('/lecturer/courses');
      if (Array.isArray(coursesRes.data)) {
        setCourses(coursesRes.data);
      } else if (coursesRes.data && coursesRes.data.success === true && Array.isArray(coursesRes.data.data)) {
        setCourses(coursesRes.data.data);
      } else if (coursesRes.data && Array.isArray(coursesRes.data.data)) {
        setCourses(coursesRes.data.data);
      } else {
        setCourses([]);
      }
      
      const assignmentsRes = await api.get('/lecturer/assignments');
      if (Array.isArray(assignmentsRes.data)) {
        setAssignments(assignmentsRes.data);
      } else if (assignmentsRes.data && assignmentsRes.data.success && Array.isArray(assignmentsRes.data.data)) {
        setAssignments(assignmentsRes.data.data);
      } else {
        setAssignments([]);
      }
      
      const submissionsRes = await api.get('/lecturer/submissions/pending');
      if (submissionsRes.data && submissionsRes.data.success && Array.isArray(submissionsRes.data.data)) {
        setSubmissions(submissionsRes.data.data);
      } else if (Array.isArray(submissionsRes.data)) {
        setSubmissions(submissionsRes.data);
      } else {
        setSubmissions([]);
      }
      
      const groupsRes = await api.get('/lecturer/groups');
      if (groupsRes.data && groupsRes.data.success && Array.isArray(groupsRes.data.data)) {
        setGroups(groupsRes.data.data);
      } else if (groupsRes.data && groupsRes.data.groups && Array.isArray(groupsRes.data.groups)) {
        setGroups(groupsRes.data.groups);
      } else if (Array.isArray(groupsRes.data)) {
        setGroups(groupsRes.data);
      } else {
        setGroups([]);
      }
      
      const studentsRes = await api.get('/lecturer/students');
      if (studentsRes.data && studentsRes.data.success && Array.isArray(studentsRes.data.data)) {
        setStudents(studentsRes.data.data);
      } else if (Array.isArray(studentsRes.data)) {
        setStudents(studentsRes.data);
      } else {
        setStudents([]);
      }
      
      const announcementsRes = await api.get('/lecturer/announcements');
      if (announcementsRes.data && announcementsRes.data.success && Array.isArray(announcementsRes.data.data)) {
        setAnnouncements(announcementsRes.data.data);
      } else if (Array.isArray(announcementsRes.data)) {
        setAnnouncements(announcementsRes.data);
      } else {
        setAnnouncements([]);
      }
      
      const roomsRes = await api.get('/lecturer/virtual-rooms');
      if (roomsRes.data && roomsRes.data.success && Array.isArray(roomsRes.data.data)) {
        setVirtualRooms(roomsRes.data.data);
      } else if (Array.isArray(roomsRes.data)) {
        setVirtualRooms(roomsRes.data);
      } else {
        setVirtualRooms([]);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setCourses([
      { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45, assignments: 4, pendingSubmissions: 12, avgGrade: 78.5, progress: 75, schedule: 'Mon & Wed, 2:00 PM', room: 'Lab 301' },
      { id: 2, title: 'Database Systems', code: 'CS302', students: 38, assignments: 3, pendingSubmissions: 8, avgGrade: 82.3, progress: 68, schedule: 'Tue & Thu, 10:00 AM', room: 'Lab 205' },
      { id: 3, title: 'Data Structures & Algorithms', code: 'CS301', students: 42, assignments: 4, pendingSubmissions: 15, avgGrade: 75.6, progress: 60, schedule: 'Mon & Fri, 9:00 AM', room: 'Lab 102' },
    ]);
    
    setAssignments([
      { id: 1, title: 'React.js Final Project', course: 'Advanced Web Development', dueDate: '2025-03-25', submitted: 32, total: 45, status: 'active' },
      { id: 2, title: 'Database Normalization', course: 'Database Systems', dueDate: '2025-03-20', submitted: 38, total: 38, status: 'grading' },
    ]);
    
    setSubmissions([
      { id: 1, student_name: 'John Doe', student: 'John Doe', assignment_title: 'React.js Final Project', assignment: 'React.js Final Project', assignment_id: 1, submittedDate: '2025-03-18', status: 'pending', grade: null, user_id: 101 },
      { id: 2, student_name: 'Jane Smith', student: 'Jane Smith', assignment_title: 'React.js Final Project', assignment: 'React.js Final Project', assignment_id: 1, submittedDate: '2025-03-19', status: 'pending', grade: null, user_id: 102 },
      { id: 3, student_name: 'Michael Brown', student: 'Michael Brown', assignment_title: 'Database Normalization', assignment: 'Database Normalization', assignment_id: 2, submittedDate: '2025-03-19', status: 'pending', grade: null, user_id: 103 },
    ]);
    
    setGroups([
      { id: 1, name: 'Web Development Study Group', course: 'Advanced Web Development', members: 12, status: 'active', is_member: true },
      { id: 2, name: 'Database Project Team', course: 'Database Systems', members: 8, status: 'active', is_member: false },
    ]);
    
    setStudents([
      { id: 101, name: 'John Doe', email: 'john@example.com', course: 'Advanced Web Development' },
      { id: 102, name: 'Jane Smith', email: 'jane@example.com', course: 'Database Systems' },
      { id: 103, name: 'Michael Brown', email: 'michael@example.com', course: 'Data Structures & Algorithms' },
    ]);
    
    setAnnouncements([
      { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will begin on April 15th. Please check the timetable.', course: 'All Courses', date: '2025-03-18', priority: 'high', recipients: 125 },
      { id: 2, title: 'Assignment Extension', content: 'React.js project deadline extended to March 28th.', course: 'Web Development', date: '2025-03-17', priority: 'medium', recipients: 45 },
    ]);
    
    setVirtualRooms([
      { id: 1, title: 'Web Development Lecture', course: 'Advanced Web Development', startTime: 'Today, 2:00 PM', endTime: '4:00 PM', join_url: '#' },
      { id: 2, title: 'Office Hours', course: 'Database Systems', startTime: 'Tomorrow, 10:00 AM', endTime: '12:00 PM', join_url: '#' },
    ]);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    { icon: BookOpen, title: 'My Courses', value: courses.length, change: '+0', color: '#FFD700', detail: 'Active this semester', action: () => setActiveTab('courses') },
    { icon: Users, title: 'Total Students', value: courses.reduce((sum, c) => sum + (c.students || 0), 0), change: '+12', color: '#00E5FF', detail: 'Across all courses', action: () => setActiveTab('courses') },
    { icon: ClipboardList, title: 'Assignments', value: assignments.length, change: '+2', color: '#32CD32', detail: `${assignments.filter(a => a.status === 'active').length} active`, action: () => setActiveTab('assignments') },
    { icon: CheckCircle, title: 'Pending Grading', value: submissions.filter(s => s.status === 'pending').length, change: '+5', color: '#FF6B6B', detail: 'Need attention', action: () => setActiveTab('grade') },
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'grade', label: 'Grade Submissions', icon: CheckCircle },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'rooms', label: 'Virtual Rooms', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // ==================== RENDER FUNCTIONS ====================
  
  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>My Courses Overview</h2>
          <button onClick={() => setActiveTab('courses')} className="flex items-center gap-1 text-sm hover:underline" style={{ color: colors.primary }}>View All <ChevronRight size={16} /></button>
        </div>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id, course.title)}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-4xl">📚</div>
                <div className="flex-1">
                  <div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.students} students • {course.schedule}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: colors.primary }}>{course.progress || 0}% Complete</div>
                  <div className="w-32 h-1 rounded-full mt-1" style={{ backgroundColor: `${colors.border}` }}>
                    <div className="h-1 rounded-full" style={{ width: `${course.progress || 0}%`, backgroundColor: colors.primary }} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                <button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id, course.title); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button>
                <button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id, course.title); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button>
                <button onClick={(e) => { e.stopPropagation(); handleExportGrades(course.id); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}><Download size={14} className="inline mr-1" /> Export Grades</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h2>
        <div className="space-y-3">
          <button onClick={() => setShowCreateAssignment(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}>
            <span style={{ color: colors.textPrimary }}>📝 Create Assignment</span><Plus size={18} style={{ color: colors.primary }} />
          </button>
          <button onClick={() => setShowCreateAnnouncement(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.secondary}10` }}>
            <span style={{ color: colors.textPrimary }}>📢 Post Announcement</span><Bell size={18} style={{ color: colors.secondary }} />
          </button>
          <button onClick={() => setShowCreateGroup(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}>
            <span style={{ color: colors.textPrimary }}>👥 Create Group</span><Users size={18} style={{ color: colors.primary }} />
          </button>
          <button onClick={() => setShowCreateRoom(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.secondary}10` }}>
            <span style={{ color: colors.textPrimary }}>🎥 Schedule Virtual Room</span><Video size={18} style={{ color: colors.secondary }} />
          </button>
          <button onClick={handleGenerateReport} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}>
            <span style={{ color: colors.textPrimary }}>📊 Generate Report</span><Printer size={18} style={{ color: colors.primary }} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id, course.title)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">📚</div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.room || 'Online'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
              <div className="font-bold" style={{ color: colors.primary }}>{course.students}</div>
              <div className="text-xs">Enrolled Students</div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
              <div className="font-bold" style={{ color: colors.secondary }}>{course.assignments || 0}</div>
              <div className="text-xs">Assignments</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Schedule:</span><span style={{ color: colors.textPrimary }}>{course.schedule || 'TBD'}</span></div>
            <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Avg Grade:</span><span style={{ color: colors.primary }}>{course.avgGrade || 0}%</span></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id, course.title); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button>
            <button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id, course.title); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button>
            <button onClick={(e) => { e.stopPropagation(); handleExportGrades(course.id); }} className="py-2 px-3 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}><Download size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAssignments = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>All Assignments</h2>
        <button onClick={() => setShowCreateAssignment(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Create</button>
      </div>
      <div className="space-y-3">
        {assignments.map(assignment => (
          <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewAssignment(assignment.id, assignment.title)}>
            <div>
              <div className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>{assignment.course} • Due: {assignment.dueDate || assignment.due_date}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">{assignment.submitted || assignment.submissions_count || 0}/{assignment.total || assignment.total_students || 0} submitted</div>
              <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${assignment.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{assignment.status || 'active'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGradeSubmissions = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Pending Submissions to Grade</h2>
      {submissions.filter(s => s.status === 'pending').length === 0 ? (
        <div className="text-center p-8" style={{ color: colors.textSecondary }}>✅ All caught up! No pending submissions to grade.</div>
      ) : (
        submissions.filter(s => s.status === 'pending').map((submission) => (
          <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg mb-2" style={{ backgroundColor: `${colors.primary}05` }}>
            <div>
              <div className="font-medium" style={{ color: colors.textPrimary }}>{submission.student_name || submission.student}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>{submission.assignment_title || submission.assignment} • {submission.submittedDate || submission.created_at?.split('T')[0]}</div>
            </div>
            <button onClick={() => handleGradeSubmission(submission)} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Grade</button>
          </div>
        ))
      )}
    </div>
  );

  const renderGroups = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map(group => (
        <div key={group.id} className="glass-card p-5 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleJoinGroup(group.id, group.name)}>
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} style={{ color: colors.primary }} />
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{group.name}</h3>
          </div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{group.course}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: colors.textSubtle }}>{group.members} members</span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">{group.status}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id, group.name); }} className="mt-3 w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Join Group Chat</button>
        </div>
      ))}
      <button onClick={() => setShowCreateGroup(true)} className="glass-card p-5 flex items-center justify-center gap-2 hover:scale-102 transition-all" style={{ border: `2px dashed ${colors.primary}` }}>
        <Plus size={20} style={{ color: colors.primary }} />
        <span style={{ color: colors.primary }}>Create New Group</span>
      </button>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2>
        <button onClick={() => setShowCreateAnnouncement(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Bell size={16} /> Post Announcement</button>
      </div>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="p-4 rounded-lg mb-3 cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold" style={{ color: colors.textPrimary }}>{announcement.title}</div>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{announcement.content}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-500' : announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{announcement.priority}</span>
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span style={{ color: colors.textSubtle }}>{announcement.course} • {announcement.date}</span>
            <span style={{ color: colors.primary }}>Sent to {announcement.recipients} students</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVirtualRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {virtualRooms.map((room) => (
        <div key={room.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleJoinRoom(room.id, room.title)}>
          <div className="flex items-center gap-3 mb-3">
            <Video size={24} style={{ color: colors.primary }} />
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{room.title}</h3>
          </div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{room.course}</p>
          <div className="flex items-center gap-2 text-sm mb-3">
            <Clock size={14} style={{ color: colors.textSubtle }} />
            <span style={{ color: colors.textSecondary }}>{room.startTime || room.start_time} - {room.endTime || room.end_time}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleJoinRoom(room.id, room.title); }} className="w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Join Virtual Room</button>
        </div>
      ))}
      <button onClick={() => setShowCreateRoom(true)} className="glass-card p-6 flex items-center justify-center gap-2 hover:scale-102 transition-all" style={{ border: `2px dashed ${colors.primary}` }}>
        <Plus size={20} style={{ color: colors.primary }} />
        <span style={{ color: colors.primary }}>Schedule New Room</span>
      </button>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Performance</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Attendance</span><span style={{ color: colors.primary }}>87%</span></div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '87%', backgroundColor: colors.primary }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Submission Rate</span><span style={{ color: colors.primary }}>78%</span></div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78%', backgroundColor: colors.secondary }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Grade</span><span style={{ color: colors.primary }}>78.3%</span></div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78.3%', backgroundColor: '#32CD32' }} /></div>
          </div>
        </div>
      </div>
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Top & Bottom Performing</h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
            <div className="text-sm" style={{ color: colors.textSecondary }}>🏆 Best Performing Course</div>
            <div className="font-bold" style={{ color: colors.primary }}>Database Systems (82.3%)</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.error}10` }}>
            <div className="text-sm" style={{ color: colors.textSecondary }}>📉 Needs Improvement</div>
            <div className="font-bold" style={{ color: colors.error }}>Data Structures & Algorithms (75.6%)</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span>Email Notifications</span>
          <button onClick={() => showNotificationMessage('Email notification settings updated', 'success')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span>SMS Alerts</span>
          <button onClick={() => showNotificationMessage('SMS alert settings updated', 'success')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span>Dark Mode</span>
          <button onClick={() => showNotificationMessage(`Dark mode ${isDark ? 'disabled' : 'enabled'}`, 'success')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>{isDark ? 'Light' : 'Dark'}</button>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span>Profile Information</span>
          <button onClick={() => navigate('/lecturer/profile')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Edit Profile</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading && activeTab === 'overview') {
      return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div></div>;
    }
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'assignments': return renderAssignments();
      case 'grade': return renderGradeSubmissions();
      case 'groups': return renderGroups();
      case 'announcements': return renderAnnouncements();
      case 'rooms': return renderVirtualRooms();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}>
            {notification.type === 'success' && <CheckCircle size={20} className="text-white" />}
            {notification.type === 'error' && <AlertCircle size={20} className="text-white" />}
            {notification.type === 'info' && <Bell size={20} className="text-white" />}
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-xl`} style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderRight: `1px solid ${colors.border}` }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          {sidebarOpen ? <h1 className="text-xl font-bold" style={{ color: colors.primary }}>Lecturer Portal</h1> : <h1 className="text-xl font-bold" style={{ color: colors.primary }}>LP</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: colors.textSecondary }}>☰</button>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🏫</div>
            {sidebarOpen && <div><p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'Prof. Johnson'}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Lecturer</p></div>}
          </div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${activeTab === item.id ? 'font-semibold' : ''}`} style={{ backgroundColor: activeTab === item.id ? `${colors.primary}15` : 'transparent', color: activeTab === item.id ? colors.primary : colors.textSecondary }}>
              <item.icon size={18} />{sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t space-y-2" style={{ borderColor: colors.border }}>
          
          {/* COURSE DISCUSSION */}
          <div className="space-y-1">
            <p className="text-xs px-1" style={{ color: colors.textSubtle }}>COURSE DISCUSSION</p>
            <button 
              onClick={() => {
                if (courses && courses.length > 0) {
                  const validCourses = courses.filter(c => c.id && typeof c.id === 'number' && c.id > 0);
                  if (validCourses.length === 0) {
                    showNotificationMessage('No valid courses found', 'error');
                    return;
                  }
                  const firstCourse = validCourses[0];
                  setSelectedChatType('course');
                  setSelectedChatId(Number(firstCourse.id));
                  setSelectedChatName(`${firstCourse.title} Discussion`);
                  setShowChat(true);
                } else {
                  showNotificationMessage('No courses available. Please contact administrator.', 'error');
                }
              }} 
              className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" 
              style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary }}
            >
              <Globe size={18} /> {sidebarOpen && <span>Course Chat</span>}
            </button>
          </div>

          {/* PRIVATE CHAT */}
          <div className="space-y-1">
            <p className="text-xs px-1" style={{ color: colors.textSubtle }}>PRIVATE MESSAGE</p>
            <button 
              onClick={() => {
                if (students && students.length > 0) {
                  setSelectedChatType('private');
                  setSelectedChatId(students[0].id);
                  setSelectedChatName(`Chat with ${students[0].name}`);
                  setShowChat(true);
                } else {
                  showNotificationMessage('No students available', 'error');
                }
              }} 
              className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" 
              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
            >
              <LockIcon size={18} /> {sidebarOpen && <span>Private Chat</span>}
            </button>
          </div>

          {/* STUDY GROUPS - FIXED */}
          <div className="space-y-1">
            <p className="text-xs px-1" style={{ color: colors.textSubtle }}>STUDY GROUPS</p>
            <button 
              onClick={async () => {
                try {
                  setLoading(true);
                  const groupsRes = await api.get('/lecturer/groups');
                  let availableGroups = [];
                  
                  if (groupsRes.data && groupsRes.data.success && Array.isArray(groupsRes.data.data)) {
                    availableGroups = groupsRes.data.data;
                  } else if (groupsRes.data && groupsRes.data.groups && Array.isArray(groupsRes.data.groups)) {
                    availableGroups = groupsRes.data.groups;
                  } else if (Array.isArray(groupsRes.data)) {
                    availableGroups = groupsRes.data;
                  }
                  
                  if (availableGroups && availableGroups.length > 0) {
                    const validGroup = availableGroups[0];
                    setSelectedChatType('group');
                    setSelectedChatId(validGroup.id);
                    setSelectedChatName(validGroup.name);
                    setShowChat(true);
                  } else {
                    showNotificationMessage('No groups available. Please create a group first.', 'error');
                    setActiveTab('groups');
                  }
                } catch (error) {
                  console.error('Error loading groups:', error);
                  showNotificationMessage('Please create a group first in the Groups tab', 'error');
                  setActiveTab('groups');
                } finally {
                  setLoading(false);
                }
              }} 
              className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" 
              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
            >
              <Users size={18} /> {sidebarOpen && <span>Group Chat</span>}
            </button>
          </div>

          <div className="border-t my-2" style={{ borderColor: colors.border }}></div>
          
          <button onClick={handleHelp} className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" style={{ color: colors.textSecondary, backgroundColor: `${colors.primary}10` }}>
            <HelpCircle size={18} />{sidebarOpen && <span>Help Center</span>}
          </button>
          
          <button onClick={handleSyncData} className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" style={{ color: colors.textSecondary, backgroundColor: `${colors.primary}10` }}>
            <RefreshCw size={18} />{sidebarOpen && <span>Sync Data</span>}
          </button>
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" style={{ color: '#FF4444', backgroundColor: '#FF444410' }}>
            <LogOut size={18} />{sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 flex justify-between items-center shadow-sm" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Lecturer Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={handleSyncData} className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><RefreshCw size={14} /> Sync</button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🏫</div>
            <span className="text-sm hidden md:block" style={{ color: colors.textSecondary }}>{user?.name?.split(' ')[0] || 'Prof.'}</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6 hover:scale-105 transition-all cursor-pointer" style={{ border: `1px solid ${colors.border}` }} onClick={stat.action}>
                  <div className="flex items-center justify-between mb-3"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={24} style={{ color: stat.color }} /></div><span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{stat.change}</span></div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</h3>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{stat.title}</p>
                  <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>{stat.detail}</p>
                </motion.div>
              ))}
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateAssignment(false)}>
          <div className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Assignment</h3><button onClick={() => setShowCreateAssignment(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <input type="text" placeholder="Assignment Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
              <textarea rows={3} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.course_id} onChange={(e) => setNewAssignment({...newAssignment, course_id: e.target.value})}>
                <option value="">Select Course *</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" placeholder="Due Date *" className="px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.due_date} onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})} />
                <input type="time" placeholder="Due Time" className="px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.due_time} onChange={(e) => setNewAssignment({...newAssignment, due_time: e.target.value})} />
              </div>
              <input type="number" placeholder="Total Points" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.total_points} onChange={(e) => setNewAssignment({...newAssignment, total_points: parseInt(e.target.value)})} />
              <button onClick={handleCreateAssignment} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Creating...' : 'Create Assignment'}</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateAnnouncement(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Post Announcement</h3><button onClick={() => setShowCreateAnnouncement(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <input type="text" placeholder="Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <textarea rows={3} placeholder="Content *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.course_id} onChange={(e) => setNewAnnouncement({...newAnnouncement, course_id: e.target.value})}>
                <option value="">All Courses</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button onClick={handleCreateAnnouncement} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Posting...' : 'Post Announcement'}</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL - FIXED */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateGroup(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Study Group</h3>
              <button onClick={() => setShowCreateGroup(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
              <div className="space-y-3">
                <input type="text" placeholder="Group Name *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} required />
                <textarea rows={2} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newGroup.description} onChange={(e) => setNewGroup({...newGroup, description: e.target.value})} />
                <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newGroup.course_id} onChange={(e) => setNewGroup({...newGroup, course_id: e.target.value})} required>
                  <option value="">Select Course *</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <div className="text-xs" style={{ color: colors.textSubtle }}>
                  <p>📌 Groups allow students to collaborate on projects and discussions</p>
                  <p>👥 You will be automatically added as group admin</p>
                </div>
                <button type="submit" className="w-full py-2 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
                  {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div> Creating...</> : <><Users size={16} /> Create Group</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE VIRTUAL ROOM MODAL - COMPLETELY FIXED */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateRoom(false)}>
          <div className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Schedule Virtual Room</h3>
              <button onClick={() => setShowCreateRoom(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              {/* Room Title */}
              <div>
                <label className="text-sm block mb-1" style={{ color: colors.textSecondary }}>Room Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter room title" 
                  className="w-full px-3 py-2 rounded-lg border" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} 
                  value={newRoom.title} 
                  onChange={(e) => setNewRoom({...newRoom, title: e.target.value})} 
                  required 
                />
              </div>
              
              {/* Course Selection */}
              <div>
                <label className="text-sm block mb-1" style={{ color: colors.textSecondary }}>Course *</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg border" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} 
                  value={newRoom.course_id} 
                  onChange={(e) => setNewRoom({...newRoom, course_id: e.target.value})}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code || 'No code'})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Time */}
              <div>
                <label className="text-sm block mb-1" style={{ color: colors.textSecondary }}>Start Time *</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-3 py-2 rounded-lg border" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} 
                  value={newRoom.start_time} 
                  onChange={(e) => setNewRoom({...newRoom, start_time: e.target.value})} 
                  required 
                />
              </div>
              
              {/* End Time (Optional) */}
              <div>
                <label className="text-sm block mb-1" style={{ color: colors.textSecondary }}>End Time (Optional)</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-3 py-2 rounded-lg border" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} 
                  value={newRoom.end_time} 
                  onChange={(e) => setNewRoom({...newRoom, end_time: e.target.value})} 
                />
                <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>Leave empty if no end time</p>
              </div>
              
              <div className="text-xs" style={{ color: colors.textSubtle }}>
                <p>📌 Virtual rooms allow you to conduct live lectures and meetings</p>
                <p>🔗 Students will receive a notification when the room is scheduled</p>
              </div>
              
              <button 
                onClick={handleCreateRoom} 
                className="w-full py-2 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2" 
                style={{ backgroundColor: colors.primary, color: '#000' }} 
                disabled={loading}
              >
                {loading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div> Scheduling...</>
                ) : (
                  <><Video size={16} /> Schedule Room</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-3xl h-[650px] overflow-hidden" style={{ backgroundColor: colors.background }}>
            <LiveChat 
              chatType={selectedChatType}
              chatId={selectedChatId}
              chatName={selectedChatName}
              onClose={() => setShowChat(false)} 
            />
          </div>
        </div>
      )}
      
      {/* GRADE SUBMISSION MODAL */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGradeModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Grade Submission</h3>
              <button onClick={() => setShowGradeModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <p className="text-sm" style={{ color: colors.textPrimary }}><strong>Student:</strong> {selectedSubmission.student_name || selectedSubmission.student}</p>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}><strong>Assignment:</strong> {selectedSubmission.assignment_title || selectedSubmission.assignment}</p>
              </div>
              <input type="number" placeholder="Grade (0-100) *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} />
              <textarea rows={3} placeholder="Feedback (Optional)" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={gradeData.feedback} onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} />
              <button onClick={handleSubmitGrade} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Grading...' : 'Submit Grade'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;