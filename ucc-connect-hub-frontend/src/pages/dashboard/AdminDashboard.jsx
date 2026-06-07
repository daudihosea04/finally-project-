import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, BookOpen, MessageCircle, Bell, 
  TrendingUp, Shield, Calendar, FileText,
  Settings, Activity, BarChart3, Trash2,
  Edit, Eye, Plus, Search, Filter, Download,
  UserPlus, UserCheck, UserX, Clock, CheckCircle,
  XCircle, AlertCircle, Mail, Phone, MapPin,
  MoreVertical, RefreshCw, Printer
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const AdminDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@ucc.ac.tz', role: 'lecturer', department: 'Computer Science', status: 'active', joinDate: '2024-01-15', avatar: '👩‍🏫' },
    { id: 2, name: 'Prof. Michael Chen', email: 'michael@ucc.ac.tz', role: 'lecturer', department: 'Mathematics', status: 'active', joinDate: '2023-08-20', avatar: '👨‍🏫' },
    { id: 3, name: 'John Doe', email: 'john@ucc.ac.tz', role: 'student', department: 'IT', status: 'active', joinDate: '2024-02-10', avatar: '👨‍🎓' },
    { id: 4, name: 'Jane Smith', email: 'jane@ucc.ac.tz', role: 'student', department: 'CS', status: 'inactive', joinDate: '2023-11-05', avatar: '👩‍🎓' },
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
    { icon: Users, title: 'Total Users', value: analytics.totalUsers, change: '+12%', color: '#FFD700', delay: 0 },
    { icon: BookOpen, title: 'Active Courses', value: analytics.totalCourses, change: '+3', color: '#00E5FF', delay: 0.1 },
    { icon: MessageCircle, title: 'Messages', value: analytics.totalMessages, change: '+23%', color: '#32CD32', delay: 0.2 },
    { icon: TrendingUp, title: 'Completion Rate', value: `${analytics.completionRate}%`, change: '+5%', color: '#FF6B6B', delay: 0.3 },
  ];

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

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

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
              Admin Dashboard
            </h1>
            <p className="mt-1" style={{ color: colors.textSecondary }}>
              Welcome back, {user?.name || 'Admin'}! Here's what's happening in your institution.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`}
              style={{
                borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent',
                color: activeTab === tab.id ? colors.primary : colors.textSecondary
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Recent Activity</h2>
                <button className="text-sm" style={{ color: colors.primary }}>View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-10 transition-all"
                    style={{ backgroundColor: `${colors.primary}05` }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                      {activity.type === 'course' && <BookOpen size={18} style={{ color: colors.primary }} />}
                      {activity.type === 'assignment' && <FileText size={18} style={{ color: colors.primary }} />}
                      {activity.type === 'announcement' && <Bell size={18} style={{ color: colors.primary }} />}
                      {activity.type === 'group' && <Users size={18} style={{ color: colors.primary }} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: colors.textPrimary }}>
                        <strong>{activity.user}</strong> {activity.action}:{' '}
                        <span style={{ color: colors.primary }}>{activity.target}</span>
                      </p>
                      <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>{activity.time}</p>
                    </div>
                    <MoreVertical size={16} style={{ color: colors.textSubtle }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>System Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: colors.textSecondary }}>Server Uptime</span>
                    <span style={{ color: colors.primary }}>99.9%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}>
                    <div className="h-2 rounded-full" style={{ width: '99.9%', backgroundColor: colors.primary }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: colors.textSecondary }}>Storage Used</span>
                    <span style={{ color: colors.primary }}>45GB / 100GB</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}>
                    <div className="h-2 rounded-full" style={{ width: '45%', backgroundColor: colors.secondary }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: colors.textSecondary }}>Active Sessions</span>
                    <span style={{ color: colors.primary }}>127</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}>
                    <div className="h-2 rounded-full" style={{ width: '65%', backgroundColor: colors.secondary }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} style={{ color: colors.primary }} />
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Security Status</span>
                </div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>All systems operational. No security threats detected.</p>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Manage all users across the platform</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                    style={{ border: `1px solid ${colors.border}` }}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                  <UserPlus size={16} /> Add User
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}>
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>User</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Email</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Role</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Department</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Status</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Join Date</th>
                    <th className="text-left py-3 px-4" style={{ color: colors.textSecondary }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{user.avatar}</div>
                          <div>
                            <div className="font-medium" style={{ color: colors.textPrimary }}>{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${getRoleColor(user.role)}20`, color: getRoleColor(user.role) }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.department}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(user.status) }} />
                          <span style={{ color: getStatusColor(user.status) }}>{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{user.joinDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1 rounded hover:bg-opacity-10 transition" style={{ color: colors.primary }}>
                            <Eye size={16} />
                          </button>
                          <button className="p-1 rounded hover:bg-opacity-10 transition" style={{ color: colors.secondary }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-1 rounded hover:bg-opacity-10 transition" style={{ color: '#FF4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>User Engagement</h2>
              <div className="space-y-3">
                <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Active Users</span><span style={{ color: colors.primary }}>{analytics.activeUsers}/{analytics.totalUsers}</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%`, backgroundColor: colors.primary }} /></div></div>
                <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Assignment Submission Rate</span><span style={{ color: colors.primary }}>{analytics.assignmentsSubmitted}</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: '78%', backgroundColor: colors.secondary }} /></div></div>
                <div><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Course Completion Rate</span><span style={{ color: colors.primary }}>{analytics.completionRate}%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: `${colors.border}` }}><div className="h-2 rounded-full" style={{ width: `${analytics.completionRate}%`, backgroundColor: '#32CD32' }} /></div></div>
              </div>
            </div>
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>User Distribution</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>👨‍🏫 Lecturers</span><span className="font-bold" style={{ color: colors.primary }}>8</span></div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><span style={{ color: colors.textPrimary }}>👨‍🎓 Students</span><span className="font-bold" style={{ color: colors.secondary }}>237</span></div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>👨‍💼 Admins</span><span className="font-bold" style={{ color: colors.primary }}>3</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;