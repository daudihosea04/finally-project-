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
  X, Check, AlertTriangle, LogOut, HelpCircle
} from 'lucide-react';

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
  const [announcements, setAnnouncements] = useState([]);
  const [virtualRooms, setVirtualRooms] = useState([]);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Helper function for alerts
  const showAlert = (message) => {
    alert(message);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Navigation handlers
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleHelp = () => {
    showAlert('Help Center: Contact support at support@uccconnect.ac.tz or call +255 747 172 018');
  };

  const handleViewCourse = (courseId, courseTitle) => {
    navigate(`/lecturer/courses/${courseId}`);
  };

  const handleViewStudents = (courseId, courseTitle) => {
    showAlert(`Viewing students in ${courseTitle} - Student list will be displayed here.`);
  };

  const handleViewAssignment = (assignmentId, assignmentTitle) => {
    showAlert(`Viewing ${assignmentTitle} - Assignment details will be displayed here.`);
  };

  const handleGradeSubmission = (submission) => {
    setSelectedAssignment(submission);
    showAlert(`Grading ${submission.studentName}'s submission for ${submission.assignment}`);
  };

  const handleJoinGroup = (groupId, groupName) => {
    showAlert(`Joining ${groupName} - Group chat will be available soon.`);
  };

  const handleJoinRoom = (roomTitle) => {
    showAlert(`Joining ${roomTitle} - Virtual room will be launched soon.`);
  };

  const handleGenerateReport = () => {
    showAlert('Generating course report... Report will be downloaded shortly.');
  };

  const handleSyncData = async () => {
    showNotification('Syncing data...', 'info');
    await loadDashboardData();
    showNotification('Data synced successfully!');
  };

  const handleCreateAssignment = () => {
    setShowCreateAssignment(false);
    showAlert('Assignment created successfully! Students will be notified.');
  };

  const handleCreateAnnouncement = () => {
    setShowCreateAnnouncement(false);
    showAlert('Announcement posted successfully! All students will receive notifications.');
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(false);
    showAlert('Group created successfully! Students can now join.');
  };

  const handleCreateRoom = () => {
    setShowCreateRoom(false);
    showAlert('Virtual room scheduled successfully! Students will receive invitations.');
  };

  // Fetch data from API
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch courses from API
      try {
        const coursesResponse = await api.get('/courses/lecturer');
        if (coursesResponse.data && coursesResponse.data.data) {
          setCourses(coursesResponse.data.data);
        } else if (coursesResponse.data && coursesResponse.data.courses) {
          setCourses(coursesResponse.data.courses);
        } else {
          setCourses(coursesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
      
      // Fetch assignments from API
      try {
        const assignmentsResponse = await api.get('/assignments/lecturer');
        if (assignmentsResponse.data && assignmentsResponse.data.data) {
          setAssignments(assignmentsResponse.data.data);
        } else if (assignmentsResponse.data && assignmentsResponse.data.assignments) {
          setAssignments(assignmentsResponse.data.assignments);
        } else {
          setAssignments(assignmentsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
      
      // Fetch submissions from API
      try {
        const submissionsResponse = await api.get('/submissions/lecturer');
        if (submissionsResponse.data && submissionsResponse.data.data) {
          setSubmissions(submissionsResponse.data.data);
        } else {
          setSubmissions(submissionsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
      
      // If no data from API, load sample data
      if (courses.length === 0 && assignments.length === 0) {
        loadSampleData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Load sample data as fallback
  const loadSampleData = () => {
    setCourses([
      { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45, assignments: 4, pendingSubmissions: 12, avgGrade: 78.5, progress: 75, schedule: 'Mon & Wed, 2:00 PM', room: 'Lab 301', image: '💻' },
      { id: 2, title: 'Database Systems', code: 'CS302', students: 38, assignments: 3, pendingSubmissions: 8, avgGrade: 82.3, progress: 68, schedule: 'Tue & Thu, 10:00 AM', room: 'Lab 205', image: '🗄️' },
      { id: 3, title: 'Data Structures & Algorithms', code: 'CS301', students: 42, assignments: 4, pendingSubmissions: 15, avgGrade: 75.6, progress: 60, schedule: 'Mon & Fri, 9:00 AM', room: 'Lab 102', image: '📊' },
    ]);
    setAssignments([
      { id: 1, title: 'React.js Final Project', course: 'Advanced Web Development', dueDate: '2025-03-25', submitted: 32, total: 45, status: 'active' },
      { id: 2, title: 'Database Normalization', course: 'Database Systems', dueDate: '2025-03-20', submitted: 38, total: 38, status: 'grading' },
      { id: 3, title: 'Algorithm Analysis', course: 'Data Structures & Algorithms', dueDate: '2025-03-28', submitted: 25, total: 42, status: 'active' },
    ]);
    setSubmissions([
      { id: 1, studentName: 'John Doe', assignment: 'React.js Final Project', submittedDate: '2025-03-18', status: 'pending' },
      { id: 2, studentName: 'Jane Smith', assignment: 'Database Normalization', submittedDate: '2025-03-17', status: 'pending' },
      { id: 3, studentName: 'Michael Brown', assignment: 'React.js Final Project', submittedDate: '2025-03-19', status: 'pending' },
    ]);
    setGroups([
      { id: 1, name: 'Web Development Study Group', course: 'Advanced Web Development', members: 12, status: 'active' },
      { id: 2, name: 'Database Project Team', course: 'Database Systems', members: 8, status: 'active' },
    ]);
    setAnnouncements([
      { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will begin on April 15th. Please check the timetable.', course: 'All Courses', date: '2025-03-18', priority: 'high', recipients: 125 },
      { id: 2, title: 'Assignment Extension', content: 'React.js project deadline extended to March 28th.', course: 'Web Development', date: '2025-03-17', priority: 'medium', recipients: 45 },
    ]);
    setVirtualRooms([
      { id: 1, title: 'Web Development Lecture', course: 'Advanced Web Development', startTime: 'Today, 2:00 PM', endTime: '4:00 PM', joinUrl: '#' },
      { id: 2, title: 'Office Hours', course: 'Database Systems', startTime: 'Tomorrow, 10:00 AM', endTime: '12:00 PM', joinUrl: '#' },
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

  // Sidebar menu items
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

  // Render functions for tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>My Courses Overview</h2><button onClick={() => setActiveTab('courses')} className="flex items-center gap-1 text-sm hover:underline" style={{ color: colors.primary }}>View All <ChevronRight size={16} /></button></div>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id, course.title)}>
              <div className="flex items-center gap-4 flex-wrap"><div className="text-4xl">{course.image || '📚'}</div><div className="flex-1"><div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.students} students • {course.schedule}</div></div><div className="text-right"><div className="text-sm font-semibold" style={{ color: colors.primary }}>{course.progress || 0}% Complete</div><div className="w-32 h-1 rounded-full mt-1" style={{ backgroundColor: `${colors.border}` }}><div className="h-1 rounded-full" style={{ width: `${course.progress || 0}%`, backgroundColor: colors.primary }} /></div></div></div>
              <div className="mt-3 flex gap-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                <button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id, course.title); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button>
                <button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id, course.title); }} className="flex-1 text-center text-sm py-1 rounded" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button>
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
  );

  const renderCourses = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {courses.map((course, index) => (
        <div key={course.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.id, course.title)}>
          <div className="flex items-center gap-4 mb-4"><div className="text-5xl">{course.image || '📚'}</div><div><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.room || 'Online'}</p></div></div>
          <div className="grid grid-cols-2 gap-3 mb-4"><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="font-bold" style={{ color: colors.primary }}>{course.students}</div><div className="text-xs">Enrolled Students</div></div><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><div className="font-bold" style={{ color: colors.secondary }}>{course.assignments || 0}</div><div className="text-xs">Assignments</div></div></div>
          <div className="space-y-2 text-sm"><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Schedule:</span><span style={{ color: colors.textPrimary }}>{course.schedule || 'TBD'}</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Avg Grade:</span><span style={{ color: colors.primary }}>{course.avgGrade || 0}%</span></div></div>
          <div className="mt-4 flex gap-2"><button onClick={(e) => { e.stopPropagation(); handleViewCourse(course.id, course.title); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Manage Course</button><button onClick={(e) => { e.stopPropagation(); handleViewStudents(course.id, course.title); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Students</button></div>
        </div>
      ))}
    </div>
  );

  const renderAssignments = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>All Assignments</h2><button onClick={() => setShowCreateAssignment(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Create</button></div>
      <div className="space-y-3">
        {assignments.map(assignment => (
          <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewAssignment(assignment.id, assignment.title)}>
            <div><div className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{assignment.course} • Due: {assignment.dueDate}</div></div>
            <div className="text-right"><div className="text-sm">{assignment.submitted || 0}/{assignment.total || 0} submitted</div><div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${assignment.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{assignment.status}</div></div>
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
        submissions.filter(s => s.status === 'pending').map((submission, index) => (
          <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg mb-2" style={{ backgroundColor: `${colors.primary}05` }}>
            <div><div className="font-medium" style={{ color: colors.textPrimary }}>{submission.studentName}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{submission.assignment} • {submission.submittedDate}</div></div>
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
          <div className="flex items-center gap-3 mb-2"><Users size={24} style={{ color: colors.primary }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{group.name}</h3></div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{group.course}</p>
          <div className="flex justify-between items-center"><span className="text-sm" style={{ color: colors.textSubtle }}>{group.members} members</span><span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">{group.status}</span></div>
        </div>
      ))}
      <button onClick={() => setShowCreateGroup(true)} className="glass-card p-5 flex items-center justify-center gap-2 hover:scale-102 transition-all" style={{ border: `2px dashed ${colors.primary}` }}><Plus size={20} style={{ color: colors.primary }} /><span style={{ color: colors.primary }}>Create New Group</span></button>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2><button onClick={() => setShowCreateAnnouncement(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Bell size={16} /> Post Announcement</button></div>
      {announcements.map((announcement, index) => (
        <div key={announcement.id} className="p-4 rounded-lg mb-3 cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-start"><div><div className="font-bold" style={{ color: colors.textPrimary }}>{announcement.title}</div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{announcement.content}</p></div><span className={`text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-500' : announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{announcement.priority}</span></div>
          <div className="mt-3 flex justify-between text-xs"><span style={{ color: colors.textSubtle }}>{announcement.course} • {announcement.date}</span><span style={{ color: colors.primary }}>Sent to {announcement.recipients} students</span></div>
        </div>
      ))}
    </div>
  );

  const renderVirtualRooms = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {virtualRooms.map((room, index) => (
        <div key={room.id} className="glass-card p-6 cursor-pointer hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }} onClick={() => handleJoinRoom(room.title)}>
          <div className="flex items-center gap-3 mb-3"><Video size={24} style={{ color: colors.primary }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{room.title}</h3></div>
          <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{room.course}</p>
          <div className="flex items-center gap-2 text-sm mb-3"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{room.startTime} - {room.endTime}</span></div>
          <button onClick={(e) => { e.stopPropagation(); handleJoinRoom(room.title); }} className="w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Join Virtual Room</button>
        </div>
      ))}
      <button onClick={() => setShowCreateRoom(true)} className="glass-card p-6 flex items-center justify-center gap-2 hover:scale-102 transition-all" style={{ border: `2px dashed ${colors.primary}` }}><Plus size={20} style={{ color: colors.primary }} /><span style={{ color: colors.primary }}>Schedule New Room</span></button>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Performance</h2>
        <div className="space-y-3"><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Attendance</span><span style={{ color: colors.primary }}>87%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '87%', backgroundColor: colors.primary }} /></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Submission Rate</span><span style={{ color: colors.primary }}>78%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78%', backgroundColor: colors.secondary }} /></div></div><div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Average Grade</span><span style={{ color: colors.primary }}>78.3%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78.3%', backgroundColor: '#32CD32' }} /></div></div></div>
      </div>
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Top & Bottom Performing</h2>
        <div className="space-y-3"><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="text-sm" style={{ color: colors.textSecondary }}>🏆 Best Performing Course</div><div className="font-bold" style={{ color: colors.primary }}>Database Systems</div></div><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.error}10` }}><div className="text-sm" style={{ color: colors.textSecondary }}>📉 Needs Improvement</div><div className="font-bold" style={{ color: colors.error }}>Data Structures & Algorithms</div></div></div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Email Notifications</span><button onClick={() => showAlert('Toggle email notifications')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>SMS Alerts</span><button onClick={() => showAlert('Toggle SMS alerts')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Dark Mode</span><button onClick={() => showAlert('Dark mode toggled')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>{isDark ? 'Light' : 'Dark'}</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Profile Information</span><button onClick={() => showAlert('Edit profile feature coming soon')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Edit</button></div>
      </div>
    </div>
  );

  const renderContent = () => {
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

      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-xl`} style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderRight: `1px solid ${colors.border}` }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          {sidebarOpen ? <h1 className="text-xl font-bold" style={{ color: colors.primary }}>Lecturer Portal</h1> : <h1 className="text-xl font-bold" style={{ color: colors.primary }}>LP</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: colors.textSecondary }}>☰</button>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🏫</div>{sidebarOpen && <div><p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'Prof. Johnson'}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Lecturer</p></div>}</div>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${activeTab === item.id ? 'font-semibold' : ''}`} style={{ backgroundColor: activeTab === item.id ? `${colors.primary}15` : 'transparent', color: activeTab === item.id ? colors.primary : colors.textSecondary }}>
              <item.icon size={18} />{sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t space-y-2" style={{ borderColor: colors.border }}>
          <button onClick={handleHelp} className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" style={{ color: colors.textSecondary, backgroundColor: `${colors.primary}10` }}><HelpCircle size={18} />{sidebarOpen && <span>Help Center</span>}</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all" style={{ color: '#FF4444', backgroundColor: '#FF444410' }}><LogOut size={18} />{sidebarOpen && <span>Logout</span>}</button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 flex justify-between items-center shadow-sm" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Lecturer Dashboard</h1>
          <div className="flex items-center gap-3"><button onClick={handleSyncData} className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><RefreshCw size={14} /> Sync</button><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🏫</div><span className="text-sm hidden md:block" style={{ color: colors.textSecondary }}>{user?.name?.split(' ')[0] || 'Prof.'}</span></div>
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

      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateAssignment(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Assignment</h3><button onClick={() => setShowCreateAssignment(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Assignment Title" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><textarea rows={3} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><input type="date" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><button onClick={handleCreateAssignment} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Create Assignment</button></div>
          </div>
        </div>
      )}

      {showCreateAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateAnnouncement(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Post Announcement</h3><button onClick={() => setShowCreateAnnouncement(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Title" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><textarea rows={3} placeholder="Message" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}><option>All Courses</option>{courses.map(c => <option key={c.id}>{c.title}</option>)}</select><button onClick={handleCreateAnnouncement} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Post Announcement</button></div>
          </div>
        </div>
      )}

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateGroup(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Group</h3><button onClick={() => setShowCreateGroup(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Group Name" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><textarea rows={2} placeholder="Description" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}><option>Select Course</option>{courses.map(c => <option key={c.id}>{c.title}</option>)}</select><button onClick={handleCreateGroup} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Create Group</button></div>
          </div>
        </div>
      )}

      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateRoom(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Schedule Virtual Room</h3><button onClick={() => setShowCreateRoom(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Room Title" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><input type="date" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><input type="time" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}><option>Select Course</option>{courses.map(c => <option key={c.id}>{c.title}</option>)}</select><button onClick={handleCreateRoom} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Schedule Room</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;