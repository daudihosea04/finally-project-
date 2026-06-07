import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const LateSubmission = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Late Submission</h2>
      <p style={{ color: colors.textSecondary }}>Configure late submission policies for {selectedCourse}</p>
      <div className="mt-4 space-y-3"><div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>Penalty per day:</span><input type="number" defaultValue={10} className="input-field w-24" style={{ border: `1px solid ${colors.border}` }} /><span style={{ color: colors.textSubtle }}>%</span></div><div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>Grace Period:</span><input type="number" defaultValue={24} className="input-field w-24" style={{ border: `1px solid ${colors.border}` }} /><span style={{ color: colors.textSubtle }}>hours</span></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Save Policy</button>
    </div>
  );
};

export default LateSubmission;