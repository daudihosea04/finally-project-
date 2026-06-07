import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, MessageCircle, CheckCircle } from 'lucide-react';

const RealTimeNotifications = () => {
  const { colors } = useTheme();
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Real-Time Notifications</h2>
      <p style={{ color: colors.textSecondary }}>Receive instant alerts and notifications</p>
      <div className="mt-4 space-y-2"><div className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><Bell size={16} style={{ color: colors.primary }} /><div><div style={{ color: colors.textPrimary }}>New submission from John Doe</div><div className="text-xs" style={{ color: colors.textSubtle }}>2 minutes ago</div></div></div></div>
    </div>
  );
};

export default RealTimeNotifications;