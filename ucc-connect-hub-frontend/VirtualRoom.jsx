import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Video, Clock } from 'lucide-react';

const VirtualRoom = ({ selectedCourse }) => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Virtual Rooms</h2>
      <p style={{ color: colors.textSecondary }}>Create online lecture rooms for {selectedCourse}</p>
      <div className="mt-4 space-y-3"><div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>Office Hours</div><div className="text-xs flex items-center gap-1"><Clock size={12} /><span style={{ color: colors.textSubtle }}>Today, 2:00 PM</span></div></div><button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}><Video size={14} className="inline mr-1" /> Join</button></div></div>
      <button className="mt-4 w-full py-2 rounded-lg text-sm" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}>+ Schedule New Room</button>
    </div>
  );
};

export default VirtualRoom;