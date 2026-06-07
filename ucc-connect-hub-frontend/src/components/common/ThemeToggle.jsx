import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
      style={{
        backgroundColor: isDark ? '#FFD700' : '#DAA520',
        boxShadow: isDark ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
      }}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute left-1 w-4 h-4 rounded-full transition-all duration-300 transform ${
          isDark ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'
        }`}
      />
      <span className="text-xs absolute left-1.5">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;