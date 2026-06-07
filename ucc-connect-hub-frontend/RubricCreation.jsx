import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Save } from 'lucide-react';

const RubricCreation = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Rubric Creation</h2>
      <p style={{ color: colors.textSecondary }}>Create grading rubrics for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="flex gap-2"><input type="text" placeholder="Criteria" className="input-field flex-1" style={{ border: `1px solid ${colors.border}` }} /><input type="number" placeholder="Points" className="input-field w-24" style={{ border: `1px solid ${colors.border}` }} /></div><button className="w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Plus size={14} /> Add Criteria</button><button className="w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2 mt-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Save size={14} /> Save Rubric</button></div>
    </div>
  );
};

export default RubricCreation;