import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, Clock, CheckCircle, Award,
  Calendar, MessageCircle, Bell, TrendingUp,
  FileText, Upload, Eye, Download,
  Users, Star, Target, Zap
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const StudentDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const enrolledCourses = [
    { id: 1, title: 'Advanced Web Development', code: 'CS401', instructor: 'Dr. Sarah Johnson', progress: 75, grade: 'A-', nextClass: 'Today, 2:00 PM', image: '💻' },
    { id: 2, title: 'Database Systems', code: 'CS302', instructor: 'Prof. Michael Chen', progress: 68, grade: 'B+', nextClass: 'Tomorrow, 10:00 AM', image: '🗄️' },
    { id: 3, title: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Emily Rodriguez', progress: 82, grade: 'A', nextClass: 'Wed, 11:00 AM', image: '📊' },
  ];

  const assignments = [
    { id: 1, title: 'React.js Project', course: 'Web Development', dueDate: '2024-03-20', status: 'pending', grade: null },
    { id: 2, title: 'Database Design', course: 'Database Systems', dueDate: '2024-03-18', status: 'graded', grade: 85 },
    { id: 3, title: 'Algorithm Analysis', course: 'Algorithms', dueDate: '2024-03-22', status: 'pending', grade: null },
  ];

  const upcomingEvents = [
    { title: 'Web Development Lecture', date: 'Today, 2:00 PM', type: 'class', icon: '📚' },
    { title: 'Study Group - Algorithms', date: 'Tomorrow, 3:00 PM', type: 'group', icon: '👥' },
    { title: 'Assignment Deadline', date: 'Mar 20, 11:59 PM', type: 'deadline', icon: '⏰' },
  ];

  const stats = [
    { icon: BookOpen, title: 'Enrolled Courses', value: enrolledCourses.length, change: '+0', color: '#FFD700', delay: 0 },
    { icon: CheckCircle, title: 'Completed Assignments', value: assignments.filter(a => a.status === 'graded').length, change: '+2', color: '#00E5FF', delay: 0.1 },
    { icon: Award, title: 'Current GPA', value: '3.8', change: '+0.3', color: '#32CD32', delay: 0.2 },
    { icon: TrendingUp, title: 'Attendance Rate', value: '92%', change: '+5%', color: '#FF6B6B', delay: 0.3 },
  ];

  const getStatusColor = (status) => {
    return status === 'graded' ? '#32CD32' : '#FFD700';
  };

  const getStatusText = (status) => {
    return status === 'graded' ? 'Graded' : 'Pending';
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Student Dashboard</h1>
          <p className="mt-1" style={{ color: colors.textSecondary }}>Welcome back, {user?.name || 'Student'}! Track your learning progress.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => <StatsCard key={index} {...stat} />)}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'courses', label: 'My Courses', icon: Users },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent', color: activeTab === tab.id ? colors.primary : colors.textSecondary }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>My Courses</h2><button className="text-sm" style={{ color: colors.primary }}>View All</button></div>
              <div className="space-y-4">
                {enrolledCourses.map((course, index) => (
                  <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{course.image}</div>
                      <div className="flex-1"><div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.instructor}</div></div>
                      <div className="text-right"><div className="text-sm font-semibold" style={{ color: colors.primary }}>{course.progress}% Complete</div><div className="w-32 h-1 rounded-full mt-1" style={{ backgroundColor: `${colors.border}` }}><div className="h-1 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: colors.primary }} /></div></div>
                    </div>
                    <div className="mt-3 flex justify-between items-center"><div className="flex items-center gap-2 text-sm"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>Next: {course.nextClass}</span></div><div className="flex items-center gap-1"><Star size={14} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>{course.grade}</span></div></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                    <div className="text-2xl">{event.icon}</div>
                    <div><div className="font-medium" style={{ color: colors.textPrimary }}>{event.title}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{event.date}</div></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-sm" style={{ color: colors.textSecondary }}>📚 Study tip: Complete your pending assignments before the deadline!</p></div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>My Assignments</h2>
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <motion.div key={assignment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
                  <div><div className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{assignment.course} • Due: {assignment.dueDate}</div></div>
                  <div className="flex items-center gap-3"><div className={`text-sm font-semibold px-3 py-1 rounded-full ${assignment.status === 'graded' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`} style={{ backgroundColor: `${getStatusColor(assignment.status)}20`, color: getStatusColor(assignment.status) }}>{getStatusText(assignment.status)}</div>{assignment.status === 'graded' ? <div className="text-lg font-bold" style={{ color: colors.primary }}>{assignment.grade}%</div> : <button className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Upload size={16} /></button>}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;