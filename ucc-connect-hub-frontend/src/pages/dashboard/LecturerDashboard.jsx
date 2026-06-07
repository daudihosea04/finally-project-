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
  X, Check, AlertTriangle
} from 'lucide-react';

const LecturerDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [virtualRooms, setVirtualRooms] = useState([]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [coursesRes, assignmentsRes, submissionsRes, groupsRes, announcementsRes] = await Promise.all([
        api.get('/courses/lecturer/' + user?.id),
        api.get('/assignments'),
        api.get('/submissions'),
        api.get('/groups'),
        api.get('/announcements')
      ]);
      setCourses(coursesRes.data.data || coursesRes.data || []);
      setAssignments(assignmentsRes.data.data || assignmentsRes.data || []);
      setSubmissions(submissionsRes.data.data || submissionsRes.data || []);
      setGroups(groupsRes.data.data || groupsRes.data || []);
      setAnnouncements(announcementsRes.data.data || announcementsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
      // Fallback to sample data if API fails
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setCourses([
      { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45, assignments: 4, pendingSubmissions: 12, avgGrade: 78.5, progress: 75, schedule: 'Mon & Wed, 2:00 PM', room: 'Lab 301', image: '💻' },
      { id: 2, title: 'Database Systems', code: 'CS302', students: 38, assignments: 3, pendingSubmissions: 8, avgGrade: 82.3, progress: 68, schedule: 'Tue & Thu, 10:00 AM', room: 'Lab 205', image: '🗄️' },
    ]);
    setAssignments([
      { id: 1, title: 'React.js Final Project', course: 'Advanced Web Development', dueDate: '2024-03-25', submitted: 32, total: 45, status: 'active' },
      { id: 2, title: 'Database Normalization', course: 'Database Systems', dueDate: '2024-03-20', submitted: 38, total: 38, status: 'grading' },
    ]);
    setSubmissions([
      { id: 1, studentName: 'John Doe', assignment: 'React.js Final Project', submittedDate: '2024-03-18', status: 'pending' },
      { id: 2, studentName: 'Jane Smith', assignment: 'Database Normalization', submittedDate: '2024-03-17', status: 'pending' },
    ]);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Assignment Actions
  const handleCreateAssignment = async (assignmentData) => {
    setLoading(true);
    try {
      const response = await api.post('/assignments', assignmentData);
      showNotification('Assignment created successfully!');
      setShowCreateAssignment(false);
      fetchDashboardData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    setLoading(true);
    try {
      await api.put(`/submissions/${submissionId}`, { grade, feedback });
      showNotification('Submission graded successfully!');
      setSelectedAssignment(null);
      fetchDashboardData();
    } catch (error) {
      showNotification('Failed to grade submission', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Group Actions
  const handleCreateGroup = async (groupData) => {
    setLoading(true);
    try {
      await api.post('/groups', groupData);
      showNotification('Group created successfully!');
      setShowCreateGroup(false);
      fetchDashboardData();
    } catch (error) {
      showNotification('Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      showNotification('Joined group successfully!');
      fetchDashboardData();
    } catch (error) {
      showNotification('Failed to join group', 'error');
    }
  };

  // Announcement Actions
  const handleCreateAnnouncement = async (announcementData) => {
    setLoading(true);
    try {
      await api.post('/announcements', announcementData);
      showNotification('Announcement posted successfully!');
      setShowCreateAnnouncement(false);
      fetchDashboardData();
    } catch (error) {
      showNotification('Failed to post announcement', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Virtual Room Actions
  const handleCreateRoom = async (roomData) => {
    setLoading(true);
    try {
      await api.post('/virtual-rooms', roomData);
      showNotification('Virtual room created successfully!');
      setShowCreateRoom(false);
      fetchDashboardData();
    } catch (error) {
      showNotification('Failed to create virtual room', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (joinUrl) => {
    window.open(joinUrl, '_blank');
  };

  // Navigation handlers
  const handleViewCourse = (courseId) => {
    navigate(`/lecturer/courses/${courseId}`);
  };

  const handleViewStudents = (courseId) => {
    navigate(`/lecturer/courses/${courseId}/students`);
  };

  const handleViewAssignment = (assignmentId) => {
    navigate(`/lecturer/assignments/${assignmentId}`);
  };

  const handleViewGroupChat = (groupId) => {
    navigate(`/lecturer/groups/${groupId}/chat`);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/reports', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'course_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('Report downloaded successfully!');
    } catch (error) {
      showNotification('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    showNotification('Syncing data...', 'info');
    await fetchDashboardData();
    showNotification('Data synced successfully!');
  };

  const stats = [
    { icon: BookOpen, title: 'My Courses', value: courses.length, change: '+0', color: '#FFD700', detail: 'Active this semester', action: () => setActiveTab('courses') },
    { icon: Users, title: 'Total Students', value: courses.reduce((sum, c) => sum + (c.students || 0), 0), change: '+12', color: '#00E5FF', detail: 'Across all courses', action: () => setActiveTab('courses') },
    { icon: ClipboardList, title: 'Assignments', value: assignments.length, change: '+2', color: '#32CD32', detail: `${assignments.filter(a => a.status === 'active').length} active`, action: () => setActiveTab('assignments') },
    { icon: CheckCircle, title: 'Pending Grading', value: submissions.filter(s => s.status === 'pending').length, change: '+5', color: '#FF6B6B', detail: 'Need attention', action: () => setActiveTab('grade') },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
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

      <div className="container mx-auto max-w-7xl">
        {/* Header with Sync Button */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Lecturer Dashboard</h1>
            <p className="mt-1" style={{ color: colors.textSecondary }}>Welcome back, {user?.name || 'Prof. Johnson'}! Manage your courses, assignments, and student engagement.</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setActiveTab('courses')} className="text-xs px-2 py-1 rounded-full transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>📚 {courses.length} Courses</button>
              <button onClick={() => setActiveTab('courses')} className="text-xs px-2 py-1 rounded-full transition-all hover:scale-105" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>👥 {courses.reduce((sum, c) => sum + (c.students || 0), 0)} Students</button>
            </div>
          </div>
          <button onClick={handleSyncData} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>

        {/* Stats Grid - All Clickable */}
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

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'overview' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'overview' ? colors.primary : 'transparent', color: activeTab === 'overview' ? colors.primary : colors.textSecondary, backgroundColor: activeTab === 'overview' ? 'transparent' : 'transparent' }}><BarChart3 size={18} /> Overview</button>
          <button onClick={() => setActiveTab('courses')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'courses' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'courses' ? colors.primary : 'transparent', color: activeTab === 'courses' ? colors.primary : colors.textSecondary }}><BookOpen size={18} /> My Courses</button>
          <button onClick={() => setActiveTab('assignments')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'assignments' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'assignments' ? colors.primary : 'transparent', color: activeTab === 'assignments' ? colors.primary : colors.textSecondary }}><ClipboardList size={18} /> Assignments</button>
          <button onClick={() => setActiveTab('grade')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'grade' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'grade' ? colors.primary : 'transparent', color: activeTab === 'grade' ? colors.primary : colors.textSecondary }}><CheckCircle size={18} /> Grade Submissions</button>
          <button onClick={() => setActiveTab('groups')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'groups' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'groups' ? colors.primary : 'transparent', color: activeTab === 'groups' ? colors.primary : colors.textSecondary }}><Users size={18} /> Manage Groups</button>
          <button onClick={() => setActiveTab('announcements')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'announcements' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'announcements' ? colors.primary : 'transparent', color: activeTab === 'announcements' ? colors.primary : colors.textSecondary }}><Bell size={18} /> Announcements</button>
          <button onClick={() => setActiveTab('rooms')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'rooms' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'rooms' ? colors.primary : 'transparent', color: activeTab === 'rooms' ? colors.primary : colors.textSecondary }}><Video size={18} /> Virtual Rooms</button>
          <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'analytics' ? 'border-b-2' : 'hover:bg-opacity-10'}`} style={{ borderBottomColor: activeTab === 'analytics' ? colors.primary : 'transparent', color: activeTab === 'analytics' ? colors.primary : colors.textSecondary }}><TrendingUp size={18} /> Analytics</button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>My Courses Overview</h2><button onClick={() => setActiveTab('courses')} className="flex items-center gap-1 text-sm hover:underline" style={{ color: colors.primary }}>View All <ChevronRight size={16} /></button></div>
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id)}>
                    <div className="flex items-center gap-4 flex-wrap"><div className="text-4xl">{course.image || '📚'}</div><div className="flex-1"><div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.students} students • {course.schedule}</div></div><div className="text-right"><div className="text-sm font-semibold" style={{ color: colors.primary }}>{course.progress || 0}% Complete</div><div className="w-32 h-1 rounded-full mt-1" style={{ backgroundColor: `${colors.border}` }}><div className="h-1 rounded-full" style={{ width: `${course.progress || 0}%`, backgroundColor: colors.primary }} /></div></div></div>
                    <div className="mt-3 flex gap-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                      <button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button>
                      <button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setShowCreateAssignment(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>📝 Create Assignment</span><Plus size={18} style={{ color: colors.primary }} /></button>
                <button onClick={() => setShowCreateAnnouncement(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.secondary}10` }}><span style={{ color: colors.textPrimary }}>📢 Post Announcement</span><Bell size={18} style={{ color: colors.secondary }} /></button>
                <button onClick={() => setShowCreateGroup(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>👥 Create Group</span><Users size={18} style={{ color: colors.primary }} /></button>
                <button onClick={() => setShowCreateRoom(true)} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.secondary}10` }}><span style={{ color: colors.textPrimary }}>🎥 Schedule Virtual Room</span><Video size={18} style={{ color: colors.secondary }} /></button>
                <button onClick={handleGenerateReport} className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-102" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>📊 Generate Report</span><Printer size={18} style={{ color: colors.primary }} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div key={course.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id)}>
                <div className="flex items-center gap-4 mb-4"><div className="text-5xl">{course.image || '📚'}</div><div><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.room || 'Online'}</p></div></div>
                <div className="grid grid-cols-2 gap-3 mb-4"><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="font-bold" style={{ color: colors.primary }}>{course.students}</div><div className="text-xs">Enrolled Students</div></div><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><div className="font-bold" style={{ color: colors.secondary }}>{course.assignments || 0}</div><div className="text-xs">Assignments</div></div></div>
                <div className="space-y-2 text-sm"><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Schedule:</span><span style={{ color: colors.textPrimary }}>{course.schedule || 'TBD'}</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Avg Grade:</span><span style={{ color: colors.primary }}>{course.avgGrade || 0}%</span></div></div>
                <div className="mt-4 flex gap-2"><button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button><button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button></div>
              </div>
            ))}
          </div>
        )}

        {/* Grade Submissions Tab */}
        {activeTab === 'grade' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Pending Submissions to Grade</h2>
            {submissions.filter(s => s.status === 'pending').map((submission, index) => (
              <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg mb-2" style={{ backgroundColor: `${colors.primary}05` }}>
                <div><div className="font-medium" style={{ color: colors.textPrimary }}>{submission.studentName}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{submission.assignment} • {submission.submittedDate}</div></div>
                <button onClick={() => setSelectedAssignment(submission)} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Grade</button>
              </div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2><button onClick={() => setShowCreateAnnouncement(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Bell size={16} /> Post Announcement</button></div>
            {announcements.map((announcement, index) => (
              <div key={announcement.id} className="p-4 rounded-lg mb-3 cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
                <div className="flex justify-between items-start"><div><div className="font-bold" style={{ color: colors.textPrimary }}>{announcement.title}</div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{announcement.content}</p></div><span className={`text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-500' : announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{announcement.priority}</span></div>
                <div className="mt-3 flex justify-between text-xs"><span style={{ color: colors.textSubtle }}>{announcement.course} • {announcement.date}</span><span style={{ color: colors.primary }}>Sent to {announcement.recipients} students</span></div>
              </div>
            ))}
          </div>
        )}

        {/* Virtual Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {virtualRooms.map((room, index) => (
              <div key={room.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleJoinRoom(room.joinUrl)}>
                <div className="flex items-center gap-3 mb-3"><Video size={24} style={{ color: colors.primary }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{room.title}</h3></div>
                <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{room.course}</p>
                <div className="flex items-center gap-2 text-sm mb-3"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{room.startTime} - {room.endTime}</span></div>
                <button onClick={(e) => { e.stopPropagation(); handleJoinRoom(room.joinUrl); }} className="w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Start Virtual Room</button>
              </div>
            ))}
            <button onClick={() => setShowCreateRoom(true)} className="glass-card p-6 flex items-center justify-center gap-2 hover:scale-105 transition-all" style={{ border: `2px dashed ${colors.primary}` }}><Plus size={20} style={{ color: colors.primary }} /><span style={{ color: colors.primary }}>Schedule New Room</span></button>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Performance</h2>
              <div className="space-y-3"><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Attendance</span><span style={{ color: colors.primary }}>87%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '87%', backgroundColor: colors.primary }} /></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Submission Rate</span><span style={{ color: colors.primary }}>78%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78%', backgroundColor: colors.secondary }} /></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Grade</span><span style={{ color: colors.primary }}>78.3%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78.3%', backgroundColor: '#32CD32' }} /></div></div></div>
            </div>
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Top & Bottom Performing</h2>
              <div className="space-y-3"><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="text-sm" style={{ color: colors.textSecondary }}>🏆 Best Performing Course</div><div className="font-bold" style={{ color: colors.primary }}>Database Systems</div></div><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.error}10` }}><div className="text-sm" style={{ color: colors.textSecondary }}>📉 Needs Improvement</div><div className="font-bold" style={{ color: colors.error }}>Algorithms</div></div></div>
            </div>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Assignment</h3><button onClick={() => setShowCreateAssignment(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Assignment Title" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><textarea rows={3} placeholder="Description" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><input type="date" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><button className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Create</button></div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Post Announcement</h3><button onClick={() => setShowCreateAnnouncement(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Title" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><textarea rows={3} placeholder="Message" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }}><option>Select Course</option>{courses.map(c => <option key={c.id}>{c.title}</option>)}</select><button className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Post</button></div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Group</h3><button onClick={() => setShowCreateGroup(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Group Name" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><textarea rows={2} placeholder="Description" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }}><option>Select Course</option>{courses.map(c => <option key={c.id}>{c.title}</option>)}</select><button className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Create Group</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;