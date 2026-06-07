import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const CourseAnalytics = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Analytics</h2>
      <p style={{ color: colors.textSecondary }}>View detailed analytics for {selectedCourse}</p>
      <div className="mt-4 grid grid-cols-2 gap-3"><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><TrendingUp size={20} style={{ color: colors.primary }} className="mx-auto mb-1" /><div className="font-bold" style={{ color: colors.textPrimary }}>87%</div><div className="text-xs">Engagement</div></div><div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><Users size={20} style={{ color: colors.secondary }} className="mx-auto mb-1" /><div className="font-bold" style={{ color: colors.textPrimary }}>45</div><div className="text-xs">Active Students</div></div></div>
    </div>
  );
};

export default CourseAnalytics;