import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { FileText, Download, Upload } from 'lucide-react';

const FileSharing = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>File Sharing</h2>
      <p style={{ color: colors.textSecondary }}>Upload and organize course materials for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-2"><FileText size={16} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>Lecture_1.pdf</span></div><Download size={16} style={{ color: colors.primary }} /></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}><Upload size={14} /> Upload New File</button>
    </div>
  );
};

export default FileSharing;