import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { BookOpen, PlayCircle, CheckCircle, Clock } from 'lucide-react';

const EnrolledCoursesSection = () => {
  const { colors } = useTheme();
  
  const stats = [
    { icon: BookOpen, title: 'Enrolled Courses', value: '8', color: '#FFD700' },
    { icon: PlayCircle, title: 'Active Courses', value: '8', color: '#00E5FF' },
    { icon: CheckCircle, title: 'Completed Courses', value: '0', color: '#32CD32' },
  ];
  
  const courses = [
    { id: 1, title: 'Secret to Master Perfect Diet & Meal Plan', progress: 67, total: 3, completed: 2, status: 'Continue Learning', image: '🥗' },
    { id: 2, title: 'Complete Financial Analyst Course', progress: 0, total: 0, completed: 0, status: 'Start Learning', image: '📊' },
    { id: 3, title: 'Sales Training: Practical Sales Techniques', progress: 0, total: 0, completed: 0, status: 'Start Learning', image: '📈' },
    { id: 4, title: 'Project Management with Trello', progress: 0, total: 0, completed: 0, status: 'Start Learning', image: '📋' },
    { id: 5, title: 'Complete Blender Creator, 3D Modelling', progress: 0, total: 0, completed: 0, status: 'Start Learning', image: '🎨' },
    { id: 6, title: 'WordPress for Beginners – Master WordPress', progress: 0, total: 0, completed: 0, status: 'Start Learning', image: '📝' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Enrolled Courses</h1>
      <p className="text-sm" style={{ color: colors.textSecondary }}>Track your enrolled courses and learning progress</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <stat.icon size={32} style={{ color: stat.color }} className="mx-auto mb-2" />
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.title}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {courses.map((course, idx) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex gap-4"><div className="text-5xl">{course.image}</div><div className="flex-1"><h3 className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3><div className="flex items-center gap-2 mt-1"><span className="text-xs" style={{ color: colors.textSecondary }}>{course.completed}/{course.total}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.progress}% Complete</span></div><div className="mt-3 w-full h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-1.5 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: colors.primary }}></div></div><button className="mt-3 px-4 py-1.5 rounded text-sm font-medium transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}>{course.status}</button></div></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCoursesSection;