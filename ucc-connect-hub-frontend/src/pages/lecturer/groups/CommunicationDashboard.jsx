import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { MessageCircle, Bell, Video, Users, Send, Plus, Search, FileText, Download, Eye, Calendar, Clock, Mic, Phone, Mail, Share2 } from 'lucide-react';

const CommunicationDashboard = () => {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const messages = [
    { id: 1, user: 'John Doe', text: 'Professor, I have a question about the assignment', time: '10:30 AM', unread: true },
    { id: 2, user: 'Jane Smith', text: 'Thank you for the feedback!', time: '9:15 AM', unread: false },
  ];

  const announcements = [
    { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will start on March 25th...', date: '2024-03-15', priority: 'high' },
    { id: 2, title: 'Guest Lecture', content: 'Special guest lecture on AI this Friday', date: '2024-03-13', priority: 'low' },
  ];

  const rooms = [
    { id: 1, title: 'Office Hours', time: 'Today, 2:00 PM', status: 'upcoming' },
    { id: 2, title: 'Database Q&A', time: 'Tomorrow, 10:00 AM', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Communication & Collaboration</h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Chat with students, post announcements, and manage virtual rooms</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2 glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Real-Time Chat</h2>
          <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
            {messages.map(msg => (<div key={msg.id} className={`p-3 rounded-lg ${msg.unread ? 'ring-1' : ''}`} style={{ backgroundColor: `${colors.primary}10`, ringColor: colors.primary }}><div className="flex justify-between"><span className="font-semibold" style={{ color: colors.primary }}>{msg.user}</span><span className="text-xs" style={{ color: colors.textSubtle }}>{msg.time}</span></div><p style={{ color: colors.textSecondary }}>{msg.text}</p></div>))}
          </div>
          <div className="flex gap-2"><input type="text" placeholder="Type your message..." className="input-field flex-1" style={{ border: `1px solid ${colors.border}` }} value={message} onChange={(e) => setMessage(e.target.value)} /><button className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Send size={16} /></button></div>
        </div>

        {/* Announcements */}
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Post Announcement</h2>
          <textarea rows={3} placeholder="Write announcement..." className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
          <button className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Bell size={16} /> Broadcast</button>
          <div className="mt-4 space-y-2"><h3 className="text-sm font-semibold" style={{ color: colors.textSecondary }}>Recent Announcements</h3>{announcements.map(ann => (<div key={ann.id} className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex justify-between"><span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{ann.title}</span><span className="text-xs" style={{ color: ann.priority === 'high' ? colors.error : colors.textSubtle }}>{ann.priority}</span></div><p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{ann.content}</p></div>))}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Virtual Rooms</h2><div className="space-y-3">{rooms.map(room => (<div key={room.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>{room.title}</div><div className="text-xs flex items-center gap-1"><Clock size={12} /><span style={{ color: colors.textSubtle }}>{room.time}</span></div></div><button className="px-3 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}><Video size={14} className="inline mr-1" /> Join</button></div>))}<button className="mt-3 w-full py-2 rounded-lg text-sm" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}>+ Schedule New Room</button></div></div>

        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Bulk Messaging</h2><textarea rows={3} placeholder="Message to all students..." className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /><button className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Mail size={16} /> Send to All Students</button></div>
      </div>

      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>File Sharing</h2><div className="grid grid-cols-2 gap-3"><div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}05` }}><span style={{ color: colors.textPrimary }}>Lecture_1.pdf</span><Download size={16} style={{ color: colors.primary }} /></div><div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}05` }}><span style={{ color: colors.textPrimary }}>Assignment_Guide.docx</span><Download size={16} style={{ color: colors.primary }} /></div></div><button className="mt-3 w-full py-2 rounded-lg text-sm flex items-center justify-center gap-2" style={{ border: `1px dashed ${colors.primary}`, color: colors.primary }}><Plus size={14} /> Upload File</button></div>
    </div>
  );
};

export default CommunicationDashboard;