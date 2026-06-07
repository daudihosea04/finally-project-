import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const { colors, isDark } = useTheme();
  
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: isDark ? '#000000' : '#FFFFFF',
    },
    secondary: {
      background: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
    },
    outline: {
      background: 'transparent',
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`,
    },
  };
  
  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${className}`}
      style={variants[variant]}
    >
      {children}
    </button>
  );
};

export default Button;