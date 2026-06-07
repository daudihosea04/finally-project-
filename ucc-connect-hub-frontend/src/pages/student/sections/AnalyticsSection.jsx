import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { TrendingUp, Users, BookOpen, Award, BarChart3, Calendar, Clock, Eye } from 'lucide-react';

const AnalyticsSection = () => {
  const { colors } = useTheme();
  
  const stats = [
    { title: 'Total Views', value: '2,847', change: '+15%', icon: Eye, color: '#FFD700' },
    { title: 'Course Completion', value: '68%', change: '+12%', icon: TrendingUp, color: '#00E5FF' },
    { title: 'Student Engagement', value: '87%', change: '+8%', icon: Users, color: '#32CD32' },
    { title: 'Average Rating', value: '4.8', change: '+0.3', icon: Award, color: '#FF6B6B' },
  ];

  const coursePerformance = [
    { name: 'Web Development', students: 45, completion: 75, rating: 4.9, revenue: 2249 },
    { name: 'Database Systems', students: 38, completion: 68, rating: 4.8, revenue: 1519 },
    { name: 'Data Structures', students: 42, completion: 82, rating: 4.9, revenue: 1889 },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Analytics</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Track your course performance and student engagement</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={24} style={{ color: stat.color }} /></div><span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>{stat.change}</span></div>
            <div className="mt-3"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{stat.title}</div></div>
          </motion.div>
        ))}
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Course Performance</h2><div className="space-y-4">{coursePerformance.map((course, idx) => (<div key={idx}><div className="flex justify-between items-center mb-2"><div><div className="font-medium" style={{ color: colors.textPrimary }}>{course.name}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{course.students} students • ${course.revenue} revenue</div></div><div className="text-sm" style={{ color: colors.primary }}>⭐ {course.rating}</div></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: `${course.completion}%`, backgroundColor: colors.primary }}></div></div></div>))}</div></div>
    </div>
  );
};

export default AnalyticsSection;