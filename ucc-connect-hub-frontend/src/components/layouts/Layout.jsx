// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, ChevronDown, User, LogOut, Settings, 
  Shield, BookOpen, MessageCircle, Bell, Sun, Moon,
  Home, Info, FileText, HelpCircle
} from 'lucide-react';

const Layout = ({ children }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to UCC Connect Hub!', read: false, time: 'Just now' }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
      setMobileMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const userName = localStorage.getItem('userName') || 'User';
    logout();
    // Toast is handled in AuthContext
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const getDashboardLink = () => {
    const role = user?.role || localStorage.getItem('userRole');
    switch(role) {
      case 'student': return '/student/dashboard';
      case 'lecturer': return '/lecturer/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/privacy', label: 'Privacy', icon: FileText },
    { path: '/terms', label: 'Terms', icon: FileText },
  ];

  // Role-based nav items
  const getRoleNavItems = () => {
    const role = user?.role || localStorage.getItem('userRole');
    if (role === 'student') {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: BookOpen },
        { path: '/student/courses', label: 'My Courses', icon: BookOpen },
        { path: '/student/messages', label: 'Messages', icon: MessageCircle },
      ];
    } else if (role === 'lecturer') {
      return [
        { path: '/lecturer/dashboard', label: 'Dashboard', icon: BookOpen },
        { path: '/lecturer/courses', label: 'My Courses', icon: BookOpen },
        { path: '/lecturer/grading', label: 'Grading', icon: BookOpen },
      ];
    } else if (role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Shield },
        { path: '/admin/users', label: 'Users', icon: User },
        { path: '/admin/analytics', label: 'Analytics', icon: BookOpen },
      ];
    }
    return [];
  };

  const roleNavItems = getRoleNavItems();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Navbar */}
      <nav 
        className="sticky top-0 z-50 shadow-lg"
        style={{ 
          backgroundColor: isDark ? colors.backgroundDarker : '#ffffff',
          borderBottom: `2px solid ${colors.primary}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: colors.primary }}
              >
                <span className="text-white font-bold">U</span>
              </div>
              <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                UCC Connect Hub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="transition-colors flex items-center gap-1"
                  style={{ 
                    color: location.pathname === item.path ? colors.primary : colors.textSecondary,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Role-based nav items (only when logged in) */}
              {isAuthenticated && roleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="transition-colors flex items-center gap-1"
                  style={{ 
                    color: location.pathname === item.path ? colors.primary : colors.textSecondary,
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right side - Theme toggle, Notifications, Profile */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: colors.textPrimary
                }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications (only when logged in) */}
              {isAuthenticated && (
                <div className="relative">
                  <button 
                    className="p-2 rounded-lg relative transition-colors"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: colors.textPrimary
                    }}
                  >
                    <Bell size={18} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                        style={{ backgroundColor: colors.primary, color: 'white' }}
                      >
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Auth Buttons or Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(!profileDropdownOpen);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: colors.textPrimary
                    }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <span className="text-white text-sm">
                        {user?.full_name?.charAt(0) || localStorage.getItem('userName')?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm">
                      {user?.full_name?.split(' ')[0] || localStorage.getItem('userName')?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50"
                      style={{ 
                        backgroundColor: isDark ? colors.backgroundDarker : '#ffffff',
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Link 
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <BookOpen size={16} /> Dashboard
                      </Link>
                      <Link 
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link 
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      <hr className="my-2" style={{ borderColor: colors.border }} />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm transition-colors w-full text-left"
                        style={{ color: '#ef4444' }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ 
                      border: `1px solid ${colors.primary}`,
                      color: colors.primary
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: isDark ? '#000' : '#fff'
                    }}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{ color: colors.textPrimary }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: colors.border }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block py-2 transition-colors"
                  style={{ color: location.pathname === item.path ? colors.primary : colors.textSecondary }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {isAuthenticated && roleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block py-2 transition-colors"
                  style={{ color: location.pathname === item.path ? colors.primary : colors.textSecondary }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t flex flex-col gap-2" style={{ borderColor: colors.border }}>
                  <Link
                    to="/login"
                    className="block py-2 text-center px-4 rounded-lg transition-all"
                    style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-center px-4 rounded-lg transition-all"
                    style={{ backgroundColor: colors.primary, color: isDark ? '#000' : '#fff' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto" style={{ 
        backgroundColor: isDark ? colors.backgroundDarker : '#f8f8f8',
        borderTop: `1px solid ${colors.border}`
      }}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>UCC Connect Hub</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Free world-class education platform connecting students and faculty.
              </p>
              <div className="mt-3 text-xs" style={{ color: colors.textSubtle }}>
                🎓 100% Free • Lifetime Access
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>About Us</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" style={{ color: colors.textSecondary }}>Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Connect</h4>
              <p className="text-sm" style={{ color: colors.textSecondary }}>📧 support@uccconnect.edu</p>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>💬 24/7 Live Chat</p>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>🌐 Available Worldwide</p>
              <div className="flex gap-3 mt-3">
                <span className="text-xl cursor-pointer">📘</span>
                <span className="text-xl cursor-pointer">🐦</span>
                <span className="text-xl cursor-pointer">📷</span>
                <span className="text-xl cursor-pointer">💼</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 text-center border-t" style={{ borderColor: colors.border }}>
            <p className="text-sm" style={{ color: colors.textSubtle }}>
              © 2026 UCC Connect Hub. All rights reserved. | Free education for everyone
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>
              Made with ❤️ for students worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;