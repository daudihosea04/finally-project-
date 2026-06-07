import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { colors, isDark } = useTheme();

  return (
    <footer className="py-8 mt-12" style={{ 
      backgroundColor: isDark ? '#050505' : '#f0f0f0', 
      borderTop: `2px solid ${colors.primary}`
    }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>UCC Connect Hub</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Connecting students, faculty, and alumni for better collaboration and learning.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xl cursor-pointer hover:scale-110 transition">📘</span>
              <span className="text-xl cursor-pointer hover:scale-110 transition">🐦</span>
              <span className="text-xl cursor-pointer hover:scale-110 transition">🔗</span>
              <span className="text-xl cursor-pointer hover:scale-110 transition">📷</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>About Us</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Courses</Link></li>
              <li><Link to="/events" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Terms of Service</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition" style={{ color: colors.textSecondary }}>Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Contact Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span style={{ color: colors.textSecondary }}>support@uccconnect.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <span style={{ color: colors.textSecondary }}>+1 234 567 890</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span style={{ color: colors.textSecondary }}>UCC Main Campus, Accra</span>
              </div>
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
  );
};

export default Footer;