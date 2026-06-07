import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Shield, Lock, Key, Fingerprint, Bell, Smartphone, Globe, AlertTriangle, CheckCircle, ChevronRight, Eye, EyeOff, Mail } from 'lucide-react';

const SecuritySection = () => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  const securityMetrics = {
    passwordStrength: 85,
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionSecurity: 'High',
    lastLogin: '2024-03-18 09:30 AM',
    devices: ['Windows PC - Chrome', 'iPhone 13 - Safari', 'MacBook - Firefox'],
    recentActivity: [
      { action: 'Login from new device', location: 'Dar es Salaam, Tanzania', time: '2024-03-18 09:30 AM', ip: '192.168.1.1', status: 'success' },
      { action: 'Password changed', location: 'Dar es Salaam, Tanzania', time: '2024-03-15 14:20 PM', ip: '192.168.1.1', status: 'success' },
      { action: 'Failed login attempt', location: 'Unknown', time: '2024-03-14 08:15 AM', ip: '203.0.113.5', status: 'failed' },
    ],
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Security Settings</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Manage your account security and privacy settings</p></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Password Security</h2><div><div className="flex justify-between text-sm mb-2"><span style={{ color: colors.textSecondary }}>Password Strength</span><span style={{ color: '#32CD32' }}>Strong</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: `${securityMetrics.passwordStrength}%`, backgroundColor: '#32CD32' }}></div></div><p className="text-xs mt-2" style={{ color: colors.textSecondary }}>Your password is strong. Last changed 30 days ago.</p><button className="mt-4 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Key size={14} /> Change Password</button></div></div>
          
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><div className="flex justify-between items-center"><div><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Two-Factor Authentication</h2><p className="text-xs" style={{ color: colors.textSecondary }}>Add an extra layer of security to your account</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: twoFactorEnabled ? colors.primary : colors.border }}></div></label></div>{twoFactorEnabled && (<div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="flex items-center gap-2"><Smartphone size={14} style={{ color: colors.primary }} /><span className="text-sm" style={{ color: colors.textPrimary }}>Authenticator app connected</span></div><p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Google Authenticator • Backup codes saved</p></div>)}</div>
          
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><div className="flex justify-between items-center"><div><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Login Alerts</h2><p className="text-xs" style={{ color: colors.textSecondary }}>Get notified when someone logs into your account</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: loginAlerts ? colors.primary : colors.border }}></div></label></div>{loginAlerts && (<div className="mt-3 flex gap-3"><div className="flex items-center gap-2"><Mail size={14} style={{ color: colors.primary }} /><span className="text-sm">Email</span></div><div className="flex items-center gap-2"><Bell size={14} style={{ color: colors.primary }} /><span className="text-sm">Push Notification</span></div></div>)}</div>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Active Sessions</h2><div className="space-y-3">{securityMetrics.devices.map((device, idx) => (<div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-3"><Fingerprint size={20} style={{ color: colors.primary }} /><div><div className="font-medium" style={{ color: colors.textPrimary }}>{device}</div><div className="text-xs" style={{ color: colors.textSecondary }}>Last active: Today</div></div></div><button className="text-xs px-2 py-1 rounded transition-all hover:scale-105" style={{ color: colors.error }}>Revoke</button></div>))}</div></div>
          
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Recent Security Activity</h2><div className="space-y-3">{securityMetrics.recentActivity.map((activity, idx) => (<div key={idx} className={`flex items-start gap-3 p-2 rounded-lg hover:scale-102 transition-all ${activity.status === 'failed' ? 'ring-1 ring-red-500' : ''}`} style={{ backgroundColor: `${colors.primary}05`, ringColor: '#FF4444' }}><AlertTriangle size={16} style={{ color: activity.status === 'success' ? colors.primary : '#FF4444' }} className="mt-0.5" /><div><p className="text-sm" style={{ color: colors.textPrimary }}>{activity.action}</p><div className="flex gap-3 mt-1 text-xs"><span style={{ color: colors.textSubtle }}>{activity.time}</span><span style={{ color: colors.textSubtle }}>{activity.location}</span><span style={{ color: colors.textSubtle }}>IP: {activity.ip}</span></div></div></div>))}</div></div>
        </div>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Security Recommendations</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="flex items-center justify-between p-3 rounded-lg hover:scale-102 transition-all cursor-pointer" style={{ backgroundColor: `${colors.primary}10` }}><div className="flex items-center gap-2"><Shield size={16} style={{ color: colors.primary }} /><span className="text-sm">Enable 2FA</span></div><CheckCircle size={16} style={{ color: '#32CD32' }} /></div><div className="flex items-center justify-between p-3 rounded-lg hover:scale-102 transition-all cursor-pointer" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-2"><Lock size={16} style={{ color: colors.textSecondary }} /><span className="text-sm">Update Password</span></div><ChevronRight size={16} style={{ color: colors.textSecondary }} /></div><div className="flex items-center justify-between p-3 rounded-lg hover:scale-102 transition-all cursor-pointer" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex items-center gap-2"><Bell size={16} style={{ color: colors.textSecondary }} /><span className="text-sm">Review Sessions</span></div><ChevronRight size={16} style={{ color: colors.textSecondary }} /></div></div></div>
    </div>
  );
};

export default SecuritySection;