import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Copy, CheckCircle, FolderOpen } from 'lucide-react';

const CourseContentReuse = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Content Reuse</h2>
      <p style={{ color: colors.textSecondary }}>Copy content from previous semesters for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-2"><FolderOpen size={16} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>Fall 2025 - Assignments</span></div><Copy size={16} style={{ color: colors.primary }} /></div><div className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-2"><FolderOpen size={16} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>Fall 2025 - Lectures</span></div><Copy size={16} style={{ color: colors.primary }} /></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Copy size={14} /> Copy from Previous Semester</button>
    </div>
  );
};

export default CourseContentReuse;