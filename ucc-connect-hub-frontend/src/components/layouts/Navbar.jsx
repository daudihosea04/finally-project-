import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.border}` }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold" style={{ color: colors.primary }}>
            UCC Connect Hub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="transition hover:opacity-70" style={{ color: colors.textPrimary }}>
                {link.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>
                Dashboard
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-lg" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}>
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" style={{ color: colors.textPrimary }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: colors.border }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="block py-2 transition hover:opacity-70" style={{ color: colors.textPrimary }} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            <button onClick={toggleTheme} className="block py-2">Toggle {isDark ? 'Light' : 'Dark'} Mode</button>
            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')} className="block w-full mt-2 px-4 py-2 rounded-lg text-center" style={{ backgroundColor: colors.primary, color: '#000' }}>
                Dashboard
              </button>
            ) : (
              <div className="flex gap-3 mt-2">
                <button onClick={() => navigate('/login')} className="flex-1 px-4 py-2 rounded-lg" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}>Login</button>
                <button onClick={() => navigate('/register')} className="flex-1 px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Sign Up</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;