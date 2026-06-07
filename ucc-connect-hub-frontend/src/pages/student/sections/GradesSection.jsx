import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Award, TrendingUp, Star, Download, CheckCircle, Clock } from 'lucide-react';

const GradesSection = () => {
  const { colors } = useTheme();
  
  const courses = [
    { id: 1, code: 'CS401', title: 'Advanced Web Development', assignments: 5, avgGrade: 85, grade: 'A-', credit: 3, status: 'In Progress' },
    { id: 2, code: 'CS302', title: 'Database Systems', assignments: 4, avgGrade: 78, grade: 'B+', credit: 3, status: 'In Progress' },
    { id: 3, code: 'CS301', title: 'Data Structures', assignments: 6, avgGrade: 89, grade: 'A', credit: 3, status: 'In Progress' },
  ];
  
  const assignments = [
    { title: 'React.js Final Project', course: 'Web Development', score: 85, maxScore: 100, percentage: 85, letter: 'A-', date: '2024-03-25', feedback: 'Great work on the API integration!' },
    { title: 'Database Normalization', course: 'Database Systems', score: 95, maxScore: 100, percentage: 95, letter: 'A', date: '2024-03-20', feedback: 'Excellent! Perfect normalization.' },
    { title: 'Sorting Algorithms', course: 'Algorithms', score: 88, maxScore: 100, percentage: 88, letter: 'B+', date: '2024-03-22', feedback: 'Good implementation, could be more efficient.' },
  ];
  
  const totalCredits = courses.reduce((sum, c) => sum + c.credit, 0);
  const totalPoints = courses.reduce((sum, c) => sum + (c.avgGrade * c.credit), 0);
  const gpa = (totalPoints / totalCredits / 10).toFixed(1);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Grades</h1><p className="text-sm" style={{ color: colors.textSecondary }}>View your academic performance and grade details</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 text-center hover:scale-105 transition-all cursor-pointer" style={{ border: `1px solid ${colors.border}` }}><Award size={32} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{gpa}</div><div className="text-sm">Current GPA</div><div className="text-xs mt-1" style={{ color: colors.textSubtle }}>on {totalCredits} credits</div></div>
        <div className="glass-card p-5 text-center hover:scale-105 transition-all cursor-pointer" style={{ border: `1px solid ${colors.border}` }}><Star size={32} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-3xl font-bold" style={{ color: colors.textPrimary }}>3.8</div><div className="text-sm">Cumulative GPA</div><div className="text-xs mt-1" style={{ color: colors.textSubtle }}>Overall Performance</div></div>
        <div className="glass-card p-5 text-center hover:scale-105 transition-all cursor-pointer" style={{ border: `1px solid ${colors.border}` }}><TrendingUp size={32} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-3xl font-bold" style={{ color: colors.textPrimary }}>85%</div><div className="text-sm">Average Grade</div><div className="text-xs mt-1" style={{ color: colors.textSubtle }}>All Courses</div></div>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Course Grades</h2><button className="text-sm flex items-center gap-1 transition-all hover:scale-105" style={{ color: colors.primary }}><Download size={14} /> Export Grades</button></div><div className="space-y-3">{courses.map((course, idx) => (<div key={course.id} className="p-3 rounded-lg hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex justify-between items-start"><div><div className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{course.code} • {course.credit} credits</div></div><div className="text-right"><div className="text-lg font-bold" style={{ color: colors.primary }}>{course.grade}</div><div className="text-xs">{course.avgGrade}%</div></div></div><div className="mt-2"><div className="flex justify-between text-xs mb-1"><span style={{ color: colors.textSecondary }}>Progress</span><span style={{ color: colors.primary }}>{Math.round(course.avgGrade)}%</span></div><div className="w-full h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${course.avgGrade}%`, backgroundColor: colors.primary }}></div></div></div></div>))}</div></div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Assignment Grades</h2><div className="overflow-x-auto"><table className="w-full"><thead><tr style={{ borderBottom: `2px solid ${colors.border}` }}><th className="text-left py-3" style={{ color: colors.textSecondary }}>Assignment</th><th className="text-left py-3" style={{ color: colors.textSecondary }}>Course</th><th className="text-left py-3" style={{ color: colors.textSecondary }}>Score</th><th className="text-left py-3" style={{ color: colors.textSecondary }}>Grade</th><th className="text-left py-3" style={{ color: colors.textSecondary }}>Date</th><th className="text-left py-3" style={{ color: colors.textSecondary }}>Feedback</th></tr></thead><tbody>{assignments.map((assignment, idx) => (<tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}><td className="py-3" style={{ color: colors.textPrimary }}>{assignment.title}</td><td className="py-3" style={{ color: colors.textSecondary }}>{assignment.course}</td><td className="py-3"><span style={{ color: colors.primary }}>{assignment.score}/{assignment.maxScore}</span></td><td className="py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{assignment.letter}</span></td><td className="py-3" style={{ color: colors.textSecondary }}>{assignment.date}</td><td className="py-3" style={{ color: colors.textSecondary }}>{assignment.feedback}</td></tr>))}</tbody></table></div></div>
    </div>
  );
};

export default GradesSection;