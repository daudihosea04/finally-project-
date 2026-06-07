import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { BookOpen, Clock, MapPin, User, Award, Search, Filter, ChevronRight } from 'lucide-react';

const CoursesSection = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  
  const courses = [
    { id: 1, code: 'CS401', title: 'Advanced Web Development', credits: 3, progress: 75, grade: 'A-', instructor: 'Prof. Sarah Johnson', schedule: 'Mon & Wed, 2:00 PM', room: 'Lab 301', attendance: 92, image: '💻', completed: false },
    { id: 2, code: 'CS302', title: 'Database Systems', credits: 3, progress: 68, grade: 'B+', instructor: 'Prof. Michael Chen', schedule: 'Tue & Thu, 10:00 AM', room: 'Lab 205', attendance: 88, image: '🗄️', completed: false },
    { id: 3, code: 'CS301', title: 'Data Structures', credits: 3, progress: 82, grade: 'A', instructor: 'Dr. Emily Rodriguez', schedule: 'Mon & Fri, 11:00 AM', room: 'Lecture Hall B', attendance: 95, image: '📊', completed: false },
  ];
  
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const avgProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Courses</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Track your enrolled courses and academic progress</p></div><div className="flex gap-2"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search courses..." className="pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><button className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Filter size={16} /></button></div></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><BookOpen size={24} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{courses.length}</div><div className="text-xs">Total Courses</div></div><div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><Award size={24} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{totalCredits}</div><div className="text-xs">Total Credits</div></div><div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><TrendingUp size={24} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{avgProgress}%</div><div className="text-xs">Avg Progress</div></div></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((course, idx) => (<motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5 group hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }}><div className="flex justify-between items-start"><div className="flex gap-3"><div className="text-4xl">{course.image}</div><div><h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>{course.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.credits} Credits</p></div></div><span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.grade}</span></div><div className="mt-3"><div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Progress</span><span style={{ color: colors.primary }}>{course.progress}%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%`, backgroundColor: colors.primary }}></div></div></div><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="flex items-center gap-2"><User size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.instructor}</span></div><div className="flex items-center gap-2"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.schedule}</span></div><div className="flex items-center gap-2"><MapPin size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.room}</span></div><div className="flex items-center gap-2"><Award size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>Attendance: {course.attendance}%</span></div></div><button className="mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}>Continue Learning <ChevronRight size={14} className="inline ml-1" /></button></motion.div>))}</div>
    </div>
  );
};

export default CoursesSection;