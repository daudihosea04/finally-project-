import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Search, AlertTriangle } from 'lucide-react';

const PlagiarismChecker = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Plagiarism Checker</h2>
      <p style={{ color: colors.textSecondary }}>Check submissions for plagiarism for {selectedCourse}</p>
      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex justify-between"><span style={{ color: colors.textPrimary }}>John Doe - Assignment 1</span><span className="text-sm" style={{ color: '#32CD32' }}>12% Similarity</span></div><div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: colors.border }}><div className="w-3/12 h-1 rounded-full" style={{ backgroundColor: '#32CD32' }} /></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Search size={14} /> Check Submission</button>
    </div>
  );
};

export default PlagiarismChecker;