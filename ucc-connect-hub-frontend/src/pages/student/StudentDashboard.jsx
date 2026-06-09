import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, Clock, CheckCircle, Award,
  Calendar, MessageCircle, Bell, TrendingUp,
  FileText, Upload, Eye, Download,
  Users, Star, Target, Zap, LogOut, Settings, HelpCircle
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';

const StudentDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Helper function for alerts
  const showAlert = (message) => {
    alert(message);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Navigation handlers
  const handleViewAllCourses = () => {
    setActiveTab('courses');
  };

  const handleViewCourse = (courseTitle) => {
    showAlert(`Opening ${courseTitle} - Course materials will be displayed here.`);
  };

  const handleUploadAssignment = (assignmentTitle) => {
    showAlert(`Upload assignment: ${assignmentTitle}\n\nFile upload functionality will be available soon.`);
  };

  const handleViewAssignment = (assignmentTitle) => {
    showAlert(`Viewing ${assignmentTitle} - Assignment details will be displayed here.`);
  };

  const handleJoinStudyGroup = () => {
    showAlert('Study group feature coming soon! You will be able to join discussion groups.');
  };

  const handleViewEvent = (eventTitle) => {
    showAlert(`Event: ${eventTitle}\n\nMore details will be displayed here.`);
  };

  const handleViewCertificate = () => {
    showAlert('Viewing certificates - Your certificates will be displayed here.');
  };

  const handleViewProfile = () => {
    setActiveTab('profile');
  };

  const handleSettings = () => {
    setActiveTab('settings');
  };

  const handleHelp = () => {
    showAlert('Help Center: Contact support at support@uccconnect.ac.tz or call +255 747 172 018');
  };

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

  // Sidebar menu items
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BookOpen },
    { id: 'courses', label: 'My Courses', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  // Render functions for different tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* My Courses */}
      <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>My Courses</h2>
          <button onClick={handleViewAllCourses} className="text-sm hover:opacity-80" style={{ color: colors.primary }}>View All →</button>
        </div>
        <div className="space-y-4">
          {enrolledCourses.map((course, index) => (
            <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.title)}>
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
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }} onClick={() => handleViewEvent(event.title)}>
              <div className="text-2xl">{event.icon}</div>
              <div><div className="font-medium" style={{ color: colors.textPrimary }}>{event.title}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{event.date}</div></div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg text-center cursor-pointer hover:opacity-80" style={{ backgroundColor: `${colors.primary}10` }} onClick={handleJoinStudyGroup}>
          <p className="text-sm" style={{ color: colors.textSecondary }}>👥 Join Study Group →</p>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>My Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrolledCourses.map(course => (
          <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }} onClick={() => handleViewCourse(course.title)}>
            <div className="flex items-center gap-3"><div className="text-3xl">{course.image}</div><div><h3 className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.credits || 3} credits</p></div></div>
            <div className="mt-3"><div className="flex justify-between text-sm"><span>Progress</span><span>{course.progress}%</span></div><div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: colors.border }}><div className="h-1.5 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: colors.primary }}></div></div></div>
            <div className="flex gap-2 mt-3"><button onClick={(e) => { e.stopPropagation(); showAlert(`Viewing materials for ${course.title}`); }} className="flex-1 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: colors.primary, color: '#000' }}>View Materials</button><button onClick={(e) => { e.stopPropagation(); showAlert(`Joining chat for ${course.title}`); }} className="flex-1 px-2 py-1 rounded-lg text-xs" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Chat</button></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>My Assignments</h2>
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <motion.div key={assignment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
            <div><div className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{assignment.course} • Due: {assignment.dueDate}</div></div>
            <div className="flex items-center gap-3">
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${assignment.status === 'graded' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`} style={{ backgroundColor: `${getStatusColor(assignment.status)}20`, color: getStatusColor(assignment.status) }}>{getStatusText(assignment.status)}</div>
              {assignment.status === 'graded' ? 
                <div className="text-lg font-bold cursor-pointer hover:opacity-80" style={{ color: colors.primary }} onClick={() => handleViewAssignment(assignment.title)}>{assignment.grade}%</div> : 
                <button onClick={() => handleUploadAssignment(assignment.title)} className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Upload size={16} /></button>
              }
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Class Schedule</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b" style={{ borderColor: colors.border }}><th className="p-2 text-left">Time</th><th className="p-2 text-left">Monday</th><th className="p-2 text-left">Tuesday</th><th className="p-2 text-left">Wednesday</th><th className="p-2 text-left">Thursday</th><th className="p-2 text-left">Friday</th></tr></thead>
          <tbody>
            <tr className="border-t" style={{ borderColor: colors.border }}><td className="p-2">9-11 AM</td><td className="p-2">Web Dev</td><td className="p-2">Database</td><td className="p-2">Web Dev</td><td className="p-2">Algorithms</td><td className="p-2">-</td></tr>
            <tr className="border-t" style={{ borderColor: colors.border }}><td className="p-2">11-1 PM</td><td className="p-2">Algorithms</td><td className="p-2">Web Dev Lab</td><td className="p-2">Database Lab</td><td className="p-2">Study Group</td><td className="p-2">-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Messages</h2>
      <div className="space-y-3">
        <div className="p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }} onClick={() => showAlert('Opening conversation with Dr. Sarah Johnson')}>
          <div className="flex justify-between"><span className="font-semibold" style={{ color: colors.textPrimary }}>Dr. Sarah Johnson</span><span className="text-xs" style={{ color: colors.textSubtle }}>10:30 AM</span></div>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Please submit your assignments by Friday...</p>
        </div>
        <div className="p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }} onClick={() => showAlert('Opening conversation with Study Group')}>
          <div className="flex justify-between"><span className="font-semibold" style={{ color: colors.textPrimary }}>Study Group - Algorithms</span><span className="text-xs" style={{ color: colors.textSubtle }}>Yesterday</span></div>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Meeting at 2PM in the library...</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2"><input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} /><button className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Send</button></div>
    </div>
  );

  const renderNotifications = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Notifications</h2>
      <div className="space-y-3">
        <div className="p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05`, borderLeft: `3px solid ${colors.primary}` }} onClick={() => showAlert('Assignment deadline reminder')}>
          <div className="flex justify-between"><span className="font-semibold" style={{ color: colors.textPrimary }}>📝 Assignment Deadline</span><span className="text-xs" style={{ color: colors.textSubtle }}>2 hours ago</span></div>
          <p className="text-sm" style={{ color: colors.textSecondary }}>React.js Project is due in 2 days</p>
        </div>
        <div className="p-3 rounded-lg cursor-pointer hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }} onClick={() => showAlert('Grade released notification')}>
          <div className="flex justify-between"><span className="font-semibold" style={{ color: colors.textPrimary }}>✅ Grade Released</span><span className="text-xs" style={{ color: colors.textSubtle }}>1 day ago</span></div>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Database Design assignment graded: 85%</p>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>My Profile</h2>
      <div className="flex items-center gap-4 mb-6"><div className="text-6xl">👨‍🎓</div><div><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{user?.name || 'John Doe'}</h3><p style={{ color: colors.textSecondary }}>{user?.email || 'student@ucc.ac.tz'}</p><p style={{ color: colors.textSecondary }}>Registration: UCC/DIT/2024/001</p></div></div>
      <div className="grid md:grid-cols-2 gap-4"><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span className="text-sm" style={{ color: colors.textSecondary }}>Programme</span><p className="font-semibold">Diploma in Information Technology</p></div><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span className="text-sm" style={{ color: colors.textSecondary }}>Year/Semester</span><p className="font-semibold">Year 2 • Semester 1</p></div><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span className="text-sm" style={{ color: colors.textSecondary }}>Current GPA</span><p className="font-semibold">3.8/4.0</p></div><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span className="text-sm" style={{ color: colors.textSecondary }}>Phone</span><p className="font-semibold">+255 712 345 678</p></div></div>
      <button onClick={() => showAlert('Edit profile feature coming soon')} className="mt-4 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Edit Profile</button>
    </div>
  );

  const renderSettings = () => (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Email Notifications</span><button onClick={() => showAlert('Toggle email notifications')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>SMS Alerts</span><button onClick={() => showAlert('Toggle SMS alerts')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span>Dark Mode</span><button onClick={() => showAlert('Dark mode toggled')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>{isDark ? 'Light' : 'Dark'}</button></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'assignments': return renderAssignments();
      case 'schedule': return renderSchedule();
      case 'messages': return renderMessages();
      case 'notifications': return renderNotifications();
      case 'profile': return renderProfile();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col shadow-xl`} style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', borderRight: `1px solid ${colors.border}` }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
          {sidebarOpen ? <h1 className="text-xl font-bold" style={{ color: colors.primary }}>Student Portal</h1> : <h1 className="text-xl font-bold" style={{ color: colors.primary }}>UC</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: colors.textSecondary }}>☰</button>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🎓</div>{sidebarOpen && <div><p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'John Doe'}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Student</p></div>}</div>
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
          <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Student Dashboard</h1>
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>👨‍🎓</div><span className="text-sm hidden md:block" style={{ color: colors.textSecondary }}>{user?.name?.split(' ')[0] || 'Student'}</span></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards - Only show on overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => <StatsCard key={index} {...stat} />)}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;