import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, Calendar, Clock, Bell, 
  Mail, MessageCircle, Users, FileText, Star, 
  Menu, X, LogOut, Settings, Shield
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

// Import sections
import OverviewSection from './sections/OverviewSection';
import CoursesSection from './sections/CoursesSection';
import CalendarSection from './sections/CalendarSection';
import TimetableSection from './sections/TimetableSection';
import AnnouncementsSection from './sections/AnnouncementsSection';
import ChatSection from './sections/ChatSection';
import GroupsSection from './sections/GroupsSection';
import AssignmentsSection from './sections/AssignmentsSection';
import GradesSection from './sections/GradesSection';
import SecuritySection from './sections/SecuritySection';

const StudentDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [notifications] = useState([
    { id: 1, message: 'New assignment posted: React Project', time: '5 min ago', read: false },
    { id: 2, message: 'Your grade for Database assignment is available', time: '1 hour ago', read: false },
  ]);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'groups', label: 'Discussions', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'grades', label: 'Grades', icon: Star },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'overview': return <OverviewSection />;
      case 'courses': return <CoursesSection />;
      case 'calendar': return <CalendarSection />;
      case 'timetable': return <TimetableSection />;
      case 'announcements': return <AnnouncementsSection />;
      case 'chat': return <ChatSection />;
      case 'groups': return <GroupsSection />;
      case 'assignments': return <AssignmentsSection />;
      case 'grades': return <GradesSection />;
      case 'security': return <SecuritySection />;
      default: return <OverviewSection />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      
      {/* ========== SIDEBAR - Fixed width, flex-shrink-0 ========== */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full flex-shrink-0 z-30 flex flex-col shadow-2xl overflow-y-auto"
        style={{ 
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff', 
          borderRight: `1px solid ${colors.border}` 
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h1 className="text-xl font-bold" style={{ color: colors.primary }}>UCC Connect</h1>
                <p className="text-xs" style={{ color: colors.textSubtle }}>Student Portal</p>
              </div>
            ) : (
              <div className="text-2xl font-bold mx-auto" style={{ color: colors.primary }}>UC</div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.textSecondary }}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          
          {/* User Info - ONLY IN SIDEBAR */}
          {sidebarOpen && (
            <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `${colors.primary}30` }}>👨‍🎓</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{user?.name || 'John Doe'}</p>
                <p className="text-xs" style={{ color: colors.textSubtle }}>Student • ID: UCC/2024/001</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeSection === item.id ? 'ring-2' : 'hover:bg-opacity-5'}`}
              style={{ 
                backgroundColor: activeSection === item.id ? `${colors.primary}15` : 'transparent', 
                ringColor: activeSection === item.id ? colors.primary : 'transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <item.icon size={20} style={{ color: activeSection === item.id ? colors.primary : colors.textSecondary }} />
              {sidebarOpen && <span className="text-sm" style={{ color: activeSection === item.id ? colors.primary : colors.textSecondary }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {/* Social Links */}
        {sidebarOpen && (
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>Connect With Us</p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:scale-110 transition-all" style={{ backgroundColor: '#1877F220', color: '#1877F2' }}><FaFacebook size={16} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:scale-110 transition-all" style={{ backgroundColor: '#1DA1F220', color: '#1DA1F2' }}><FaTwitter size={16} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:scale-110 transition-all" style={{ backgroundColor: '#0077B520', color: '#0077B5' }}><FaLinkedin size={16} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:scale-110 transition-all" style={{ backgroundColor: '#E4405F20', color: '#E4405F' }}><FaInstagram size={16} /></a>
            </div>
          </div>
        )}
        
        {/* Logout */}
        {sidebarOpen && (
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.error }}>
              <LogOut size={18} /> <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </motion.aside>
      
      {/* ========== MAIN CONTENT - flex-1 takes remaining space ========== */}
      {/* REMOVED: ml-[280px] - Flexbox handles positioning automatically */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 backdrop-blur-md px-6 py-3 flex justify-between items-center flex-shrink-0" style={{ 
          backgroundColor: isDark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.95)',
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg" style={{ color: colors.textSecondary }}>
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              {menuItems.find(i => i.id === activeSection)?.label}
            </h1>
          </div>
          
          {/* Notifications & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.textSecondary }}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center animate-pulse" style={{ backgroundColor: colors.error, color: '#fff' }}>{unreadCount}</span>}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>👨‍🎓</div>
              <span className="text-sm hidden md:block" style={{ color: colors.textPrimary }}>{user?.name?.split(' ')[0] || 'Student'}</span>
            </div>
          </div>
        </div>
        
        {/* Main Content - Dashboard Widgets ONLY */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;