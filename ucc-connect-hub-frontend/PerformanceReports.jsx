import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Download, Printer } from 'lucide-react';

const PerformanceReports = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Performance Reports</h2>
      <p style={{ color: colors.textSecondary }}>Generate downloadable reports for {selectedCourse}</p>
      <div className="mt-4 grid grid-cols-2 gap-3"><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Download size={16} /> PDF Report</button><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Printer size={16} /> Print</button></div>
    </div>
  );
};

export default PerformanceReports;