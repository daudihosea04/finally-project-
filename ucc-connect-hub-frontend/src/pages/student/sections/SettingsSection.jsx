import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, Lock, Eye, EyeOff, Save, Shield, Globe, Smartphone, Mail } from 'lucide-react';

const SettingsSection = () => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    assignmentReminders: true,
    gradeAlerts: true,
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Settings</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Manage your account preferences</p></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Change Password</h2><div className="space-y-3"><input type={showPassword ? 'text' : 'password'} placeholder="Current Password" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><input type={showPassword ? 'text' : 'password'} placeholder="New Password" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><input type={showPassword ? 'text' : 'password'} placeholder="Confirm New Password" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><div className="flex gap-2"><button className="flex-1 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Save size={14} className="inline mr-1" /> Update Password</button><button onClick={() => setShowPassword(!showPassword)} className="px-3 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div></div>
          
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Two-Factor Authentication</h2><button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Enable</button></div><p className="text-sm" style={{ color: colors.textSecondary }}>Add an extra layer of security to your account</p></div>
        </div>
        
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Notification Preferences</h2><div className="space-y-3"><div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>Email Notifications</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: notifications.email ? colors.primary : colors.border }}></div></label></div>
        <div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>Push Notifications</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: notifications.push ? colors.primary : colors.border }}></div></label></div>
        <div className="flex justify-between items-center"><span style={{ color: colors.textPrimary }}>SMS Notifications</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: notifications.sms ? colors.primary : colors.border }}></div></label></div></div></div>
      </div>
    </div>
  );
};

export default SettingsSection;