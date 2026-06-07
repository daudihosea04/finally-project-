import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, Clock, Calendar } from 'lucide-react';

const AssignmentReminders = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Assignment Reminders</h2>
      <p style={{ color: colors.textSecondary }}>Schedule automatic reminders for {selectedCourse}</p>
      <div className="mt-4 space-y-3"><div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>Reminder before deadline:</span><input type="number" defaultValue={24} className="input-field w-24" style={{ border: `1px solid ${colors.border}` }} /><span style={{ color: colors.textSubtle }}>hours</span></div><button className="w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Bell size={14} /> Schedule Reminders</button></div>
    </div>
  );
};

export default AssignmentReminders;