import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { CheckCircle, XCircle } from 'lucide-react';

const AttendanceTracking = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Attendance Tracking</h2>
      <p style={{ color: colors.textSecondary }}>Mark and track attendance for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><span style={{ color: colors.textPrimary }}>John Doe</span><div className="flex gap-2"><CheckCircle size={18} style={{ color: '#32CD32' }} /><XCircle size={18} style={{ color: '#FF4444' }} /></div></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Save Attendance</button>
    </div>
  );
};

export default AttendanceTracking;