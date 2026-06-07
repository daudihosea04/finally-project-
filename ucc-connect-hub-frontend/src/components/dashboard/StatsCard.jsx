import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const StatsCard = ({ icon: Icon, title, value, change, color, delay }) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 hover:scale-105 transition-all duration-300"
      style={{ border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
        {change && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: change.startsWith('+') ? '#32CD3220' : '#FF444420', color: change.startsWith('+') ? '#32CD32' : '#FF4444' }}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{value}</h3>
      <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{title}</p>
    </motion.div>
  );
};

export default StatsCard;