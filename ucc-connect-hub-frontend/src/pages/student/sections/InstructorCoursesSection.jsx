import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Plus, Edit, Trash2, Eye, Users, DollarSign, Video, FileText } from 'lucide-react';

const InstructorCoursesSection = () => {
  const { colors } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const courses = [
    { id: 1, title: 'Complete Web Development Bootcamp', students: 45, price: 49.99, rating: 4.8, status: 'Published', earnings: 2249.55, image: '💻' },
    { id: 2, title: 'Master Python Programming', students: 32, price: 39.99, rating: 4.9, status: 'Published', earnings: 1279.68, image: '🐍' },
    { id: 3, title: 'UI/UX Design Fundamentals', students: 28, price: 44.99, rating: 4.7, status: 'Draft', earnings: 0, image: '🎨' },
    { id: 4, title: 'Data Science with R', students: 18, price: 54.99, rating: 4.6, status: 'Published', earnings: 989.82, image: '📊' },
  ];

  const stats = [
    { title: 'Total Courses', value: courses.length, change: '+2', icon: BookOpen, color: '#FFD700' },
    { title: 'Total Students', value: courses.reduce((sum, c) => sum + c.students, 0), change: '+15', icon: Users, color: '#00E5FF' },
    { title: 'Total Earnings', value: `$${courses.reduce((sum, c) => sum + c.earnings, 0).toLocaleString()}`, change: '+$450', icon: DollarSign, color: '#32CD32' },
    { title: 'Average Rating', value: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1), change: '+0.2', icon: Star, color: '#FF6B6B' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Courses</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Manage your courses and track performance</p></div><button onClick={() => setShowCreateModal(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Create New Course</button></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={24} style={{ color: stat.color }} /></div><span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>{stat.change}</span></div>
            <div className="mt-3"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{stat.title}</div></div>
          </motion.div>
        ))}
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>All Courses</h2><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search courses..." className="pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} /></div></div>
        <div className="space-y-3">{courses.map((course, idx) => (<motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}><div className="flex justify-between items-start"><div className="flex gap-3"><div className="text-4xl">{course.image}</div><div><div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div><div className="flex gap-2 mt-1 text-sm"><span style={{ color: colors.textSecondary }}>👥 {course.students} students</span><span style={{ color: colors.primary }}>⭐ {course.rating}</span><span style={{ color: course.status === 'Published' ? '#32CD32' : '#FFD700' }}>{course.status}</span></div></div></div><div className="text-right"><div className="font-bold" style={{ color: colors.primary }}>${course.price}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Earned: ${course.earnings.toLocaleString()}</div></div></div><div className="mt-3 flex gap-2"><button className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Edit size={14} className="inline mr-1" /> Edit</button><button className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Eye size={14} className="inline mr-1" /> Preview</button><button className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.error}20`, color: colors.error }}><Trash2 size={14} className="inline mr-1" /> Delete</button></div></motion.div>))}</div>
      </div>
    </div>
  );
};

export default InstructorCoursesSection;