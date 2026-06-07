import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { AlertTriangle, Bell, Settings } from 'lucide-react';

const StudentAlerts = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Student Alerts</h2>
      <p style={{ color: colors.textSecondary }}>Configure performance alerts for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="p-2 rounded-lg flex items-center gap-2" style={{ backgroundColor: `${colors.error}20` }}><AlertTriangle size={16} style={{ color: colors.error }} /><span style={{ color: colors.textPrimary }}>John Doe is below 60% average</span></div><div className="p-2 rounded-lg flex items-center gap-2" style={{ backgroundColor: `${colors.primary}10` }}><Bell size={16} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>5 students have pending assignments</span></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Settings size={14} /> Configure Alert Rules</button>
    </div>
  );
};

export default StudentAlerts;