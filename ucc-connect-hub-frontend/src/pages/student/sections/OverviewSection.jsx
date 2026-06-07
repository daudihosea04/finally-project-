import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { BookOpen, PlayCircle, CheckCircle, Award, Calendar, Shield, Bell } from 'lucide-react';

const OverviewSection = () => {
  const { colors } = useTheme();
  
  const [stats, setStats] = useState({ enrolled: 0, active: 0, completed: 0, gpa: 0 });
  
  useEffect(() => {
    const targets = { enrolled: 6, active: 4, completed: 2, gpa: 3.6 };
    const duration = 2000;
    const steps = duration / 20;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const p = step / steps;
      setStats({
        enrolled: Math.floor(targets.enrolled * p),
        active: Math.floor(targets.active * p),
        completed: Math.floor(targets.completed * p),
        gpa: parseFloat((targets.gpa * p).toFixed(1))
      });
      if (step >= steps) clearInterval(timer);
    }, 20);
  }, []);

  const statCards = [
    { icon: BookOpen, title: 'Enrolled Courses', value: stats.enrolled, change: '+2', color: '#FFD700' },
    { icon: PlayCircle, title: 'In Progress', value: stats.active, change: '+1', color: '#00E5FF' },
    { icon: CheckCircle, title: 'Completed', value: stats.completed, change: '+1', color: '#32CD32' },
    { icon: Award, title: 'Current GPA', value: stats.gpa, change: '+0.2', color: '#FF6B6B' },
  ];

  return (
    <div className="w-full">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, border: `1px solid ${colors.border}` }}>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Welcome Back, Student! 👋</h1>
          <p className="mt-1" style={{ color: colors.textSecondary }}>Track your academic progress, stay updated with announcements, and connect with peers.</p>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}><BookOpen size={16} /> Continue Learning</button>
            <button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}><Calendar size={16} /> View Schedule</button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full" style={{ backgroundColor: `${colors.primary}10`, filter: 'blur(60px)' }}></div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5 group hover:scale-105 transition-all duration-300 cursor-pointer" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>{stat.change}</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.title}</div>
              <div className="text-xs mt-1" style={{ color: colors.textSubtle }}>This semester</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Security Status */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Security Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
            <Shield size={24} style={{ color: '#32CD32' }} className="mx-auto mb-2" />
            <div className="text-lg font-bold" style={{ color: '#32CD32' }}>85%</div>
            <div className="text-xs">Password Strength</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
            <Shield size={24} style={{ color: '#32CD32' }} className="mx-auto mb-2" />
            <div className="text-lg font-bold" style={{ color: '#32CD32' }}>Enabled</div>
            <div className="text-xs">2FA Status</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
            <Bell size={24} style={{ color: '#32CD32' }} className="mx-auto mb-2" />
            <div className="text-lg font-bold" style={{ color: '#32CD32' }}>On</div>
            <div className="text-xs">Login Alerts</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}>
            <Shield size={24} style={{ color: colors.primary }} className="mx-auto mb-2" />
            <div className="text-lg font-bold" style={{ color: colors.primary }}>High</div>
            <div className="text-xs">Session Security</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;