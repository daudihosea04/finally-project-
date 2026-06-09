import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, BookOpen, MessageCircle, Bell, 
  TrendingUp, Shield, Calendar, FileText,
  Settings, Activity, BarChart3, Trash2,
  Edit, Eye, Plus, Search, Filter, Download,
  UserPlus, UserCheck, UserX, Clock, CheckCircle,
  XCircle, AlertCircle, Mail, Phone, MapPin,
  MoreVertical, RefreshCw, Printer, LogOut, HelpCircle,
  X, ChevronRight, Award, Star, Target, Zap
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const AdminDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', department: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Helper functions
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

  const handleRefreshData = () => {
    showNotification('Data refreshed successfully!');
  };

  const handleViewAllActivity = () => {
    showAlert('Viewing all recent activities...');
  };

  const handleViewUser = (userName) => {
    showAlert(`Viewing details for ${userName}`);
  };

  const handleEditUser = (userName) => {
    showAlert(`Editing ${userName} - Edit form will appear here`);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newId = users.length + 1;
      const newUserData = {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || 'General',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: newUser.role === 'lecturer' ? '👩‍🏫' : newUser.role === 'admin' ? '👨‍💼' : '👨‍🎓'
      };
      setUsers([...users, newUserData]);
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', role: 'student', department: '' });
      showNotification(`User ${newUser.name} added successfully!`);
    } else {
      showAlert('Please fill in all required fields');
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      showNotification(`${userName} has been deleted.`);
    }
  };

  const handleExportUsers = () => {
    showAlert('Exporting users data to CSV...');
  };

  const handleGenerateReport = () => {
    showAlert('Generating system report... Report will be downloaded shortly.');
  };

  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@ucc.ac.tz', role: 'lecturer', department: 'Computer Science', status: 'active', joinDate: '2024-01-15', avatar: '👩‍🏫' },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael@ucc.ac.tz', role: 'lecturer', department: 'Mathematics', status: 'active', joinDate: '2023-08-20', avatar: '👨‍🏫' },
    { id: 3, name: 'John Doe', email: 'john@ucc.ac.tz', role: 'student', department: 'IT', status: 'active', joinDate: '2024-02-10', avatar: '👨‍🎓' },
    { id: 4, name: 'Jane Smith', email: 'jane@ucc.ac.tz', role: 'student', department: 'CS', status: 'inactive', joinDate: '2023-11-05', avatar: '👩‍🎓' },
    { id: 5, name: 'Admin User', email: 'admin@ucc.ac.tz', role: 'admin', department: 'Administration', status: 'active', joinDate: '2023-01-01', avatar: '👨‍💼' },
  ]);

  const [analytics, setAnalytics] = useState({
    totalUsers: 245,
    activeUsers: 189,
    totalCourses: 24,
    totalMessages: 1234,
    assignmentsSubmitted: 456,
    avgGrade: 78.5,
    completionRate: 85,
    satisfactionRate: 92
  });

  const recentActivities = [
    { id: 1, user: 'Dr. Sarah Johnson', action: 'created a new course', target: 'Advanced Web Development', time: '2 hours ago', type: 'course' },
    { id: 2, user: 'John Doe', action: 'submitted assignment', target: 'Database Systems', time: '3 hours ago', type: 'assignment' },
    { id: 3, user: 'Prof. Michael Chen', action: 'posted announcement', target: 'Midterm Exam Schedule', time: '5 hours ago', type: 'announcement' },
    { id: 4, user: 'Jane Smith', action: 'joined group', target: 'Study Group - Algorithms', time: '1 day ago', type: 'group' },
  ];

  const stats = [
    { icon: Users, title: 'Total Users', value: analytics.totalUsers, change: '+12%', color: '#FFD700', delay: 0, action: () => setActiveTab('users') },
    { icon: BookOpen, title: 'Active Courses', value: analytics.totalCourses, change: '+3', color: '#00E5FF', delay: 0.1, action: () => showAlert('Viewing all courses') },
    { icon: MessageCircle, title: 'Messages', value: analytics.totalMessages, change: '+23%', color: '#32CD32', delay: 0.2, action: () => showAlert('Viewing all messages') },
    { icon: TrendingUp, title: 'Completion Rate', value: `${analytics.completionRate}%`, change: '+5%', color: '#FF6B6B', delay: 0.3, action: () => showAlert('Viewing completion rate analytics') },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' ? '#32CD32' : '#FF4444';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? '#FFD700' : role === 'lecturer' ? '#00E5FF' : '#32CD32';
  };

  // Sidebar menu items
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Tab render functions
  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Recent Activity</h2><button onClick={handleViewAllActivity} className="text-sm hover:underline" style={{ color: colors.primary }}>View All</button></div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 p-3 rounded-lg hover:scale-102 transition-all cursor-pointer" style={{ backgroundColor: `${colors.primary}05` }} onClick={() => showAlert(`Viewing: ${activity.user} ${activity.action} ${activity.target}`)}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                {activity.type === 'course' && <BookOpen size={18} style={{ color: colors.primary }} />}
                {activity.type === 'assignment' && <FileText size={18} style={{ color: colors.primary }} />}
                {activity.type === 'announcement' && <Bell size={18} style={{ color: colors.primary }} />}
                {activity.type === 'group' && <Users size={18} style={{ color: colors.primary }} />}
              </div>
              <div className="flex-1"><p className="text-sm" style={{ color: colors.textPrimary }}><strong>{activity.user}</strong> {activity.action}: <span style={{ color: colors.primary }}>{activity.target}</span></p><p className="text-xs mt-1" style={{ color: colors.textSubtle }}>{activity.time}</p></div>
              <MoreVertical size={16} style={{ color: colors.textSubtle }} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>System Status</h2>
        <div className="space-y-4">
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Server Uptime</span><span style={{ color: colors.primary }}>99.9%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '99.9%', backgroundColor: colors.primary }} /></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Storage Used</span><span style={{ color: colors.primary }}>45GB / 100GB</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '45%', backgroundColor: colors.secondary }} /></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Active Sessions</span><span style={{ color: colors.primary }}>127</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '65%', backgroundColor: colors.secondary }} /></div></div>
        </div>
        <div className="mt-6 p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}10` }} onClick={() => showAlert('Security status: All systems operational. No threats detected.')}>
          <div className="flex items-center gap-2 mb-2"><Shield size={16} style={{ color: colors.primary }} /><span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Security Status</span></div>
          <p className="text-xs" style={{ color: colors.textSecondary }}>All systems operational. No security threats detected.</p>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2><p className="text-sm" style={{ color: colors.textSecondary }}>Manage all users across the platform</p></div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative"><Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /></div>
          <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><UserPlus size={16} /> Add User</button>
          <button onClick={handleExportUsers} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80" style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}><Download size={16} /> Export</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr style={{ borderBottom: `1px solid ${colors.border}` }}><th className="text-left py-3 px-4">User</th><th className="text-left py-3 px-4">Email</th><th className="text-left py-3 px-4">Role</th><th className="text-left py-3 px-4">Department</th><th className="text-left py-3 px-4">Status</th><th className="text-left py-3 px-4">Join Date</th><th className="text-left py-3 px-4">Actions</th></tr></thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="text-2xl">{user.avatar}</div><div className="font-medium" style={{ color: colors.textPrimary }}>{user.name}</div></div></td>
                <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.email}</td>
                <td className="py-3 px-4"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${getRoleColor(user.role)}20`, color: getRoleColor(user.role) }}>{user.role}</span></td>
                <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.department}</td>
                <td className="py-3 px-4"><span className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(user.status) }} /><span style={{ color: getStatusColor(user.status) }}>{user.status}</span></span></td>
                <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.joinDate}</td>
                <td className="py-3 px-4"><div className="flex gap-2"><button onClick={() => handleViewUser(user.name)} className="p-1 rounded hover:opacity-70 transition" style={{ color: colors.primary }}><Eye size={16} /></button><button onClick={() => handleEditUser(user.name)} className="p-1 rounded hover:opacity-70 transition" style={{ color: colors.secondary }}><Edit size={16} /></button><button onClick={() => handleDeleteUser(user.id, user.name)} className="p-1 rounded hover:opacity-70 transition" style={{ color: '#FF4444' }}><Trash2 size={16} /></button></div></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>User Engagement</h2>
        <div className="space-y-3">
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Active Users</span><span style={{ color: colors.primary }}>{analytics.activeUsers}/{analytics.totalUsers}</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%`, backgroundColor: colors.primary }} /></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Assignment Submission Rate</span><span style={{ color: colors.primary }}>{analytics.assignmentsSubmitted}</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78%', backgroundColor: colors.secondary }} /></div></div>
          <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Course Completion Rate</span><span style={{ color: colors.primary }}>{analytics.completionRate}%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: `${analytics.completionRate}%`, backgroundColor: '#32CD32' }} /></div></div>
        </div>
        <button onClick={handleGenerateReport} className="mt-4 w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Generate Full Report</button>
      </div>
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>User Distribution</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}10` }} onClick={() => showAlert('Viewing all lecturers')}><span style={{ color: colors.textPrimary }}>👨‍🏫 Lecturers</span><span className="font-bold" style={{ color: colors.primary }}>8</span></div>
          <div className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.secondary}10` }} onClick={() => showAlert('Viewing all students')}><span style={{ color: colors.textPrimary }}>👨‍🎓 Students</span><span className="font-bold" style={{ color: colors.secondary }}>237</span></div>
          <div className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}10` }} onClick={() => showAlert('Viewing all admins')}><span style={{ color: colors.textPrimary }}>👨‍💼 Admins</span><span className="font-bold" style={{ color: colors.primary }}>3</span></div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45, status: 'Active' },
          { id: 2, title: 'Database Systems', code: 'CS302', students: 38, status: 'Active' },
          { id: 3, title: 'Data Structures', code: 'CS301', students: 42, status: 'Active' },
        ].map(course => (
          <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => showAlert(`Managing course: ${course.title}`)}>
            <h3 className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.students} students</p>
            <span className="text-xs px-2 py-1 rounded-full mt-2 inline-block bg-green-500/20 text-green-500">{course.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Generate Reports</h2>
      <div className="space-y-3">
        <button onClick={() => showAlert('Generating User Activity Report...')} className="w-full text-left p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}10` }}><span>📊 User Activity Report</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
        <button onClick={() => showAlert('Generating Course Analytics Report...')} className="w-full text-left p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}10` }}><span>📚 Course Analytics Report</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
        <button onClick={() => showAlert('Generating Financial Report...')} className="w-full text-left p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}10` }}><span>💰 Financial Summary Report</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
        <button onClick={() => showAlert('Generating System Logs Report...')} className="w-full text-left p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}10` }}><span>📜 System Logs Report</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>System Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Email Notifications</span><button onClick={() => showAlert('Toggle email notifications')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>SMS Alerts</span><button onClick={() => showAlert('Toggle SMS alerts')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Maintenance Mode</span><button onClick={() => showAlert('Toggle maintenance mode')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Disable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Backup Database</span><button onClick={() => showAlert('Starting database backup...')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Run Backup</button></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUserManagement();
      case 'analytics': return renderAnalytics();
      case 'courses': return renderCourses();
      case 'reports': return renderReports();
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
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-xl`} style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderRight: `1px solid ${colors.border}` }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          {sidebarOpen ? <h1 className="text-xl font-bold" style={{ color: colors.primary }}>Admin Portal</h1> : <h1 className="text-xl font-bold" style={{ color: colors.primary }}>AD</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: colors.textSecondary }}>☰</button>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍💼</div>{sidebarOpen && <div><p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'Admin User'}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Administrator</p></div>}</div>
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 flex justify-between items-center shadow-sm" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderBottom: `1px solid ${colors.border}` }}>
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Admin Dashboard</h1>
          <div className="flex items-center gap-3"><button onClick={handleRefreshData} className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><RefreshCw size={14} /> Refresh</button><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍💼</div><span className="text-sm hidden md:block" style={{ color: colors.textSecondary }}>Admin</span></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards - Only show on overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} onClick={stat.action} className="cursor-pointer">
                  <StatsCard {...stat} />
                </div>
              ))}
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddUserModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Add New User</h3><button onClick={() => setShowAddUserModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><input type="text" placeholder="Full Name" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} /><input type="email" placeholder="Email" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} /><select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}><option value="student">Student</option><option value="lecturer">Lecturer</option><option value="admin">Admin</option></select><input type="text" placeholder="Department" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newUser.department} onChange={(e) => setNewUser({...newUser, department: e.target.value})} /><button onClick={handleAddUser} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Add User</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;