import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Video, Calendar, Clock, Users } from 'lucide-react';

const ZoomSection = () => {
  const { colors } = useTheme();
  
  const zoomMeetings = [
    { id: 1, title: 'Office Hours', date: 'March 21, 2024', time: '3:00 PM', duration: '1 hour', attendees: 12, meetingId: '123-456-789', password: 'UCC2024' },
    { id: 2, title: 'Project Presentation', date: 'March 25, 2024', time: '11:00 AM', duration: '2 hours', attendees: 30, meetingId: '987-654-321', password: 'UCC2024' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Zoom Meetings</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Schedule and join Zoom meetings</p></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {zoomMeetings.map((meeting, idx) => (
          <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                <Video size={24} style={{ color: colors.primary }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>{meeting.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.date}</span></div>
                  <div className="flex items-center gap-1"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.time} ({meeting.duration})</span></div>
                  <div className="flex items-center gap-1"><Users size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{meeting.attendees} attending</span></div>
                </div>
                <div className="mt-2 text-xs" style={{ color: colors.textSubtle }}>Meeting ID: {meeting.meetingId} • Password: {meeting.password}</div>
                <button className="mt-3 w-full py-1.5 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}><Video size={14} className="inline mr-1" /> Join Zoom Meeting</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ZoomSection;