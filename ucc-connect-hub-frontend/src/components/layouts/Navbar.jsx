import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const { colors, theme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Menu items for non-authenticated users (visitors)
  const publicMenuItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' }
  ];

  // Menu items for authenticated users (logged in)
  const privateMenuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' }
  ];

  const menuItems = isAuthenticated ? privateMenuItems : publicMenuItems;

  return (
    <nav className="sticky top-0 z-50 p-4 backdrop-blur-md" style={{ 
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)', 
      borderBottom: `1px solid ${colors.border}` 
    }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          <span style={{ color: colors.primary }}>UCC</span>
          <span style={{ color: colors.textPrimary }}> Connect Hub</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="nav-link hover:text-primary transition-colors"
              style={{ color: colors.textSecondary }}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: colors.textPrimary }}>
                👋 {user?.name || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{ 
                  border: `1px solid ${colors.primary}`,
                  color: colors.primary
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{ 
                  border: `1px solid ${colors.primary}`,
                  color: colors.primary
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  color: theme === 'dark' ? '#000' : '#fff'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;