import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Calendar, Clock, MapPin, Bell } from 'lucide-react';

const AcademicCalendarSection = () => {
  const { colors } = useTheme();
  
  const events = [
    { id: 1, title: 'Midterm Exams Begin', date: 'March 25, 2024', type: 'exam', color: '#FF4444', description: 'Midterm examinations start for all courses' },
    { id: 2, title: 'Assignment Deadline', date: 'March 30, 2024', type: 'deadline', color: '#FFD700', description: 'Final submission deadline for all assignments' },
    { id: 3, title: 'Guest Lecture: AI in Industry', date: 'April 5, 2024', type: 'event', color: '#32CD32', description: 'Special guest lecture by industry expert' },
    { id: 4, title: 'Spring Break', date: 'April 10, 2024', type: 'holiday', color: '#00E5FF', description: 'No classes' },
    { id: 5, title: 'Final Exams Begin', date: 'April 25, 2024', type: 'exam', color: '#FF4444', description: 'Final examinations start' },
    { id: 6, title: 'Semester Ends', date: 'May 10, 2024', type: 'holiday', color: '#00E5FF', description: 'End of Spring Semester' },
  ];
  
  const getTypeIcon = (type) => type === 'exam' ? '📝' : type === 'deadline' ? '⏰' : type === 'event' ? '🎉' : '🏖️';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Academic Calendar</h1>
      <p className="text-sm" style={{ color: colors.textSecondary }}>Important academic dates and events for the semester</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Upcoming Events</h2><button className="text-sm" style={{ color: colors.primary }}>Subscribe to Calendar</button></div>
          <div className="space-y-3">{events.map((event, idx) => (<motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: `${event.color}20` }}>{getTypeIcon(event.type)}</div><div className="flex-1"><div className="font-bold" style={{ color: colors.textPrimary }}>{event.title}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{event.description}</div><div className="flex gap-3 mt-1 text-xs"><span style={{ color: colors.textSubtle }}>📅 {event.date}</span></div></div><div className="text-right"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${event.color}20`, color: event.color }}>{event.type}</span></div></motion.div>))}</div>
        </div>
        
        <div className="space-y-6"><div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Important Dates</h2><div className="space-y-2"><div className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>Add/Drop Deadline</span><span style={{ color: colors.primary }}>March 10</span></div><div className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}10` }}><span style={{ color: colors.textPrimary }}>Withdrawal Deadline</span><span style={{ color: colors.secondary }}>April 15</span></div><div className="flex justify-between p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><span style={{ color: colors.textPrimary }}>Grade Release</span><span style={{ color: colors.primary }}>May 20</span></div></div></div>
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Semester Info</h2><div className="space-y-2"><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Start Date</span><span style={{ color: colors.textPrimary }}>January 15, 2024</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>End Date</span><span style={{ color: colors.textPrimary }}>May 10, 2024</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Total Weeks</span><span style={{ color: colors.textPrimary }}>16 weeks</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Holidays</span><span style={{ color: colors.textPrimary }}>5 days</span></div></div></div></div>
      </div>
    </div>
  );
};

export default AcademicCalendarSection;