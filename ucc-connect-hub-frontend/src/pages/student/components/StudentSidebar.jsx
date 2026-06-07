import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, Settings, Menu, X, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const StudentSidebar = ({ sidebarOpen, setSidebarOpen, activeSection, setActiveSection, menuSections, user }) => {
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', color: '#1877F2', url: 'https://facebook.com' },
    { icon: Twitter, name: 'Twitter', color: '#1DA1F2', url: 'https://twitter.com' },
    { icon: Linkedin, name: 'LinkedIn', color: '#0077B5', url: 'https://linkedin.com' },
    { icon: Mail, name: 'Email', color: colors.primary, url: 'mailto:support@ucc.ac.tz' },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full flex-shrink-0 fixed left-0 top-0 z-30 flex flex-col shadow-2xl overflow-y-auto"
      style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', borderRight: `1px solid ${colors.border}` }}
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
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuSections.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeSection === section.id ? 'ring-2' : 'hover:bg-opacity-5'}`}
            style={{ 
              backgroundColor: activeSection === section.id ? `${colors.primary}15` : 'transparent', 
              ringColor: activeSection === section.id ? colors.primary : 'transparent',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <span className="text-xl">{section.icon}</span>
            {sidebarOpen && <span className="text-sm" style={{ color: activeSection === section.id ? colors.primary : colors.textSecondary }}>{section.label}</span>}
          </motion.button>
        ))}
      </nav>
      
      {/* Social Links */}
      {sidebarOpen && (
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>Connect With Us</p>
          <div className="flex gap-3">
            {socialLinks.map((social, idx) => (
              <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:scale-110 transition-all" style={{ backgroundColor: `${social.color}20`, color: social.color }}>
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.textSecondary }}>
            <Settings size={18} /> <span className="text-sm">Settings</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-opacity-10 transition mt-1" style={{ color: colors.error }}>
            <LogOut size={18} /> <span className="text-sm">Logout</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
};

export default StudentSidebar;