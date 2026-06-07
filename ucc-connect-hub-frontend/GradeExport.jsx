import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Download, FileSpreadsheet } from 'lucide-react';

const GradeExport = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Export Grades</h2>
      <p style={{ color: colors.textSecondary }}>Export grades to CSV/Excel for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><button className="w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><FileSpreadsheet size={16} /> Export to CSV</button><button className="w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Download size={16} /> Export to Excel</button></div>
    </div>
  );
};

export default GradeExport;