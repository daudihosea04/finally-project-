import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Clock, MapPin, User, Award, BookOpen } from 'lucide-react';

const MyCoursesSection = () => {
  const { colors } = useTheme();
  
  const courses = [
    { id: 1, code: 'CS401', title: 'Advanced Web Development', credits: 3, progress: 75, grade: 'A-', percentage: 85, instructor: 'Prof. Sarah Johnson', schedule: 'Mon & Wed, 2:00 PM', room: 'Lab 301', attendance: 92, image: '💻' },
    { id: 2, code: 'CS302', title: 'Database Systems', credits: 3, progress: 68, grade: 'B+', percentage: 78, instructor: 'Prof. Michael Chen', schedule: 'Tue & Thu, 10:00 AM', room: 'Lab 205', attendance: 88, image: '🗄️' },
    { id: 3, code: 'CS301', title: 'Data Structures & Algorithms', credits: 3, progress: 82, grade: 'A', percentage: 89, instructor: 'Dr. Emily Rodriguez', schedule: 'Mon & Fri, 11:00 AM', room: 'Lecture Hall B', attendance: 95, image: '📊' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Courses</h1>
      <p className="text-sm" style={{ color: colors.textSecondary }}>Track your enrolled courses and academic progress</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, idx) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-4xl mb-2">{course.image}</div>
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.credits} Credits</p>
              </div>
              <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.grade}</span>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1"><span style={{ color: colors.textSecondary }}>Progress</span><span style={{ color: colors.primary }}>{course.progress}%</span></div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%`, backgroundColor: colors.primary }}></div></div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><User size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.instructor}</span></div>
              <div className="flex items-center gap-2"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.schedule}</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{course.room}</span></div>
              <div className="flex items-center gap-2"><Award size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>Attendance: {course.attendance}%</span></div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-sm transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><BookOpen size={14} className="inline mr-1" /> View Details</button>
              <button className="flex-1 py-2 rounded-lg text-sm transition-all hover:scale-105" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>View Materials</button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Course Statistics</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="text-2xl font-bold" style={{ color: colors.primary }}>{courses.length}</div><div className="text-xs">Total Courses</div></div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><div className="text-2xl font-bold" style={{ color: colors.secondary }}>{courses.reduce((sum, c) => sum + c.credits, 0)}</div><div className="text-xs">Total Credits</div></div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><div className="text-2xl font-bold" style={{ color: colors.primary }}>{Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%</div><div className="text-xs">Avg Progress</div></div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesSection;