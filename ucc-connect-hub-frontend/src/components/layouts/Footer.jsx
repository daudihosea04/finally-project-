import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { colors, isDark } = useTheme();

  return (
    <footer className="py-8 mt-12" style={{ backgroundColor: isDark ? '#0f0f1a' : '#1a1a2e', borderTop: `2px solid ${colors.primary}` }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>UCC Connect Hub</h3>
            <p className="text-sm text-gray-400">Connecting students, faculty, and alumni for better collaboration and learning.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-white transition">Courses</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white transition">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-white">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">📧 info@uccconnect.ac.tz</div>
              <div className="flex items-center gap-2">📞 +255 747 172 018</div>
              <div className="flex items-center gap-2">📍 UCC Dodoma Campus</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 text-center border-t border-gray-800">
          <p className="text-sm text-gray-500">© 2026 UCC Connect Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;