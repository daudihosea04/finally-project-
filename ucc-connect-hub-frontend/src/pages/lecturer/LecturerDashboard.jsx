import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, ChevronRight, LogOut, Settings, Bell,
  BookOpen, ClipboardList, BarChart3, MessageCircle, HelpCircle,
  Users, Calendar, FileText, Award, TrendingUp, Clock
} from 'lucide-react';

// Import Group Dashboards
import CourseStudentDashboard from './groups/CourseStudentDashboard';
import AssignmentAssessmentDashboard from './groups/AssignmentAssessmentDashboard';
import GradingAnalyticsDashboard from './groups/GradingAnalyticsDashboard';
import CommunicationDashboard from './groups/CommunicationDashboard';
import SupportDashboard from './groups/SupportDashboard';

// Settings Component
const SettingsPanel = () => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Settings</h2>
      <p style={{ color: colors.textSecondary }}>Account settings and preferences will be available here.</p>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span style={{ color: colors.textPrimary }}>Email Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: colors.primary }}></div>
          </label>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
          <span style={{ color: colors.textPrimary }}>Dark Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: colors.border }}></div>
          </label>
        </div>
      </div>
    </div>
  );
};

const LecturerDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeGroup, setActiveGroup] = useState('course-student');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuGroups = [
    { id: 'course-student', label: 'Course & Student Management', icon: BookOpen, color: '#FFD700', desc: 'Manage courses, students, attendance', count: 6 },
    { id: 'assignment-assessment', label: 'Assignment & Assessment', icon: ClipboardList, color: '#00E5FF', desc: 'Create, grade, manage assignments', count: 7 },
    { id: 'grading-analytics', label: 'Grading & Analytics', icon: BarChart3, color: '#32CD32', desc: 'Analytics, reports, grade export', count: 4 },
    { id: 'communication', label: 'Communication & Collaboration', icon: MessageCircle, color: '#FF6B6B', desc: 'Chat, announcements, virtual rooms', count: 6 },
    { id: 'support', label: 'Support & Notifications', icon: HelpCircle, color: '#9B59B6', desc: 'FAQs, real-time alerts', count: 2 },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#888888', desc: 'Account preferences', count: 0 }
  ];

  const renderDashboard = () => {
    switch(activeGroup) {
      case 'course-student': return <CourseStudentDashboard />;
      case 'assignment-assessment': return <AssignmentAssessmentDashboard />;
      case 'grading-analytics': return <GradingAnalyticsDashboard />;
      case 'communication': return <CommunicationDashboard />;
      case 'support': return <SupportDashboard />;
      case 'settings': return <SettingsPanel />;
      default: return <CourseStudentDashboard />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      
      {/* ========== SIDEBAR ========== */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full flex-shrink-0 z-30 flex flex-col shadow-2xl overflow-y-auto"
        style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', borderRight: `1px solid ${colors.border}` }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h1 className="text-xl font-bold" style={{ color: colors.primary }}>UCC Connect</h1>
                <p className="text-xs" style={{ color: colors.textSubtle }}>Lecturer Portal</p>
              </div>
            ) : (
              <div className="text-2xl font-bold mx-auto" style={{ color: colors.primary }}>UC</div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.textSecondary }}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          
          {sidebarOpen && (
            <>
              <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `${colors.primary}30` }}>👨‍🏫</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'Prof. Johnson'}</p>
                  <p className="text-xs" style={{ color: colors.textSubtle }}>{user?.email || 'lecturer@ucc.ac.tz'}</p>
                </div>
              </div>
              
              <div className="mt-3 p-2 rounded-lg text-center" style={{ backgroundColor: `${colors.primary}05` }}>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p className="text-lg font-bold" style={{ color: colors.primary }}>{currentTime.toLocaleTimeString()}</p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {menuGroups.map((group) => (
            <motion.button
              key={group.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGroup(group.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeGroup === group.id ? 'ring-2' : 'hover:bg-opacity-5'}`}
              style={{ 
                backgroundColor: activeGroup === group.id ? `${group.color}15` : 'transparent', 
                ringColor: activeGroup === group.id ? group.color : 'transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${group.color}20` }}>
                <group.icon size={18} style={{ color: group.color }} />
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-medium" style={{ color: activeGroup === group.id ? group.color : colors.textPrimary }}>{group.label}</div>
                  </div>
                  {group.count > 0 && (
                    <div className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${group.color}20`, color: group.color }}>{group.count}</div>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sidebar Footer - Logout Button */}
        {sidebarOpen && (
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-opacity-10 transition"
              style={{ color: colors.error }}
            >
              <LogOut size={18} /> <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </motion.aside>

      {/* Sidebar Toggle Button (when closed) */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 p-2 rounded-lg shadow-lg"
          style={{ backgroundColor: colors.primary, color: '#000' }}
        >
          <Menu size={20} />
        </motion.button>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 backdrop-blur-md px-6 py-3 flex justify-between items-center flex-shrink-0" style={{ 
          backgroundColor: isDark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg" style={{ color: colors.textSecondary }}>
                <Menu size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                {menuGroups.find(g => g.id === activeGroup)?.label}
              </h1>
              <p className="text-xs" style={{ color: colors.textSubtle }}>
                {menuGroups.find(g => g.id === activeGroup)?.desc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveGroup('settings')}
              className="p-2 rounded-lg hover:bg-opacity-10 transition"
              style={{ color: colors.textSecondary }}
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-opacity-10 transition"
              style={{ color: colors.error }}
            >
              <LogOut size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                👨‍🏫
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderDashboard()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-2 text-center border-t" style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', borderColor: colors.border }}>
          <p className="text-xs" style={{ color: colors.textSubtle }}>
            © 2026 UCC Connect Hub | Lecturer Portal v1.0 | UCC Dodoma
          </p>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;