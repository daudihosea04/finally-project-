import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, Menu } from 'lucide-react';

const StudentHeader = ({ sidebarOpen, setSidebarOpen, activeSection, menuSections, user }) => {
  const { colors, isDark } = useTheme();

  return (
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
          <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {menuSections.find(s => s.id === activeSection)?.label}
          </h1>
          <p className="text-xs" style={{ color: colors.textSubtle }}>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={20} style={{ color: colors.textSecondary }} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>👨‍🎓</div>
          <span className="text-sm hidden md:block" style={{ color: colors.textPrimary }}>{user?.name?.split(' ')[0] || 'Student'}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;