import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, Search, Menu } from 'lucide-react';

const DashboardHeader = ({ user }) => {
  const { colors, isDark } = useTheme();
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <header 
      className="sticky top-0 z-10 px-6 py-4 backdrop-blur-md"
      style={{
        backgroundColor: isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderBottom: `1px solid ${colors.border}`
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Teacher's Dashboard</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{currentDate}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary
              }}
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.textSecondary }}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user?.name || 'Prof. Johnson'}</p>
              <p className="text-xs" style={{ color: colors.textSubtle }}>Senior Lecturer</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              👨‍🏫
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;