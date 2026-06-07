import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from './GlassCard';

const StatsCard = ({ icon: Icon, value, label, suffix = '' }) => {
  const { colors } = useTheme();
  
  return (
    <GlassCard className="text-center">
      <Icon size={40} style={{ color: colors.primary }} className="mx-auto mb-3" />
      <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.primary }}>
        {value.toLocaleString()}{suffix}
      </div>
      <div style={{ color: colors.textSecondary }}>{label}</div>
    </GlassCard>
  );
};

export default StatsCard;