import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Video, Plus, Calendar, Clock, Users, Link, Copy } from 'lucide-react';

const GoogleMeetSection = () => {
  const { colors } = useTheme();
  
  const meetings = [
    { id: 1, title: 'Web Development Lecture', date: 'March 20, 2024', time: '2:00 PM', duration: '1 hour', attendees: 25, link: 'https://meet.google.com/abc-def-ghi' },
    { id: 2, title: 'Database Q&A Session', date: 'March 22, 2024', time: '10:00 AM', duration: '45 min', attendees: 18, link: 'https://meet.google.com/jkl-mno-pqr' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Google Meet</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Schedule and join video meetings</p></div><button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Schedule Meeting</button></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {meetings.map((meeting, idx) => (
          <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex gap-4"><div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}><Video size={24} style={{ color: colors.primary }} /></div><div className="flex-1"><h3 className="font-bold" style={{ color: colors.textPrimary }}>{meeting.title}</h3><div className="flex flex-wrap gap-3 mt-2 text-sm"><div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.date}</span></div><div className="flex items-center gap-1"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.time} ({meeting.duration})</span></div><div className="flex items-center gap-1"><Users size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.attendees} attending</span></div></div><div className="mt-3 flex gap-2"><button className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}><Video size={14} className="inline mr-1" /> Join Meeting</button><button className="px-3 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Copy size={14} className="inline mr-1" /> Copy Link</button></div></div></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GoogleMeetSection;