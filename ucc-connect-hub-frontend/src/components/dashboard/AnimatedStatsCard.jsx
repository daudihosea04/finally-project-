import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedStatsCard = ({ icon: Icon, title, value, change, color, delay = 0 }) => {
  const { colors } = useTheme();
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="glass-card p-4 relative overflow-hidden group cursor-pointer"
      style={{ border: `1px solid ${colors.border}` }}
    >
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-center justify-between mb-3">
        <motion.div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
        >
          <Icon size={24} style={{ color }} />
        </motion.div>
        <motion.span 
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
        >
          {change}
        </motion.span>
      </div>
      
      <motion.h3 
        className="text-2xl font-bold"
        style={{ color: colors.textPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {typeof value === 'string' && value.includes('%') ? `${count}%` : count.toLocaleString()}
      </motion.h3>
      
      <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{title}</p>
      
      {/* Animated progress bar at bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.5, duration: 1 }}
      />
    </motion.div>
  );
};

export default AnimatedStatsCard;