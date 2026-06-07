import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { LogOut, Settings, ChevronRight } from 'lucide-react';

const LecturerSidebar = ({ activeSection, setActiveSection, sections, user }) => {
  const { colors, isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div 
      className={`fixed left-0 top-0 h-full transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', borderRight: `1px solid ${colors.border}` }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold" style={{ color: colors.primary }}>UCC Connect</h2>
              <p className="text-xs" style={{ color: colors.textSubtle }}>Lecturer Portal</p>
            </div>
          )}
          {isCollapsed && <div className="text-2xl mx-auto">🎓</div>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-lg hover:bg-opacity-10" style={{ color: colors.textSecondary }}>
            <ChevronRight size={18} className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === section.id ? 'bg-opacity-20 font-semibold' : 'hover:bg-opacity-10'
            }`}
            style={{
              backgroundColor: activeSection === section.id ? `${colors.primary}20` : 'transparent',
              color: activeSection === section.id ? colors.primary : colors.textSecondary
            }}
          >
            <span className="text-xl">{section.icon}</span>
            {!isCollapsed && <span>{section.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: colors.border }}>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 transition-all" style={{ color: colors.textSecondary }}>
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 transition-all mt-1" style={{ color: colors.error }}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default LecturerSidebar;