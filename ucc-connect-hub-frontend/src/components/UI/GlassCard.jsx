import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const GlassCard = ({ children, className = '', hover = true }) => {
  const { colors, isDark } = useTheme();
  
  return (
    <div 
      className={`rounded-xl p-6 transition-all ${hover ? 'hover:scale-105' : ''} ${className}`}
      style={{
        backgroundColor: colors.backgroundCard,
        border: `1px solid ${colors.border}`,
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;