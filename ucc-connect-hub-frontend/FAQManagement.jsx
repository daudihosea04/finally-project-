import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Trash2, Edit } from 'lucide-react';

const FAQManagement = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>FAQ Management</h2>
      <p style={{ color: colors.textSecondary }}>Manage course FAQs for {selectedCourse}</p>
      <div className="mt-4 space-y-2"><div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex justify-between"><span className="font-medium" style={{ color: colors.textPrimary }}>When is the final exam?</span><div className="flex gap-2"><Edit size={14} style={{ color: colors.primary }} /><Trash2 size={14} style={{ color: colors.error }} /></div></div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>The final exam is scheduled for March 25th.</p></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}><Plus size={14} /> Add FAQ</button>
    </div>
  );
};

export default FAQManagement;