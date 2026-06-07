import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Bell, Filter, CheckCircle, AlertCircle, Info, Eye } from 'lucide-react';

const AnnouncementsSection = () => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');
  
  const announcements = [
    { id: 1, title: 'Midterm Exam Schedule Released', content: 'Midterm exams will start on March 25th. Please check your email for the detailed schedule.', date: '2024-03-15', priority: 'high', read: false, category: 'Academic', author: 'Registrar Office' },
    { id: 2, title: 'Library Extended Hours', content: 'Library will be open 24/7 during exam week starting March 20th.', date: '2024-03-14', priority: 'medium', read: true, category: 'Facility', author: 'Library' },
    { id: 3, title: 'Guest Lecture on AI', content: 'Special guest lecture on Artificial Intelligence this Friday at 2 PM in the Main Auditorium.', date: '2024-03-13', priority: 'low', read: false, category: 'Event', author: 'CS Department' },
    { id: 4, title: 'Assignment Deadline Extended', content: 'Deadline for Database Systems assignment extended to March 22nd.', date: '2024-03-12', priority: 'high', read: false, category: 'Course', author: 'Prof. Michael Chen' },
  ];

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <AlertCircle size={16} style={{ color: '#FF4444' }} />;
    if (priority === 'medium') return <Info size={16} style={{ color: '#FFD700' }} />;
    return <CheckCircle size={16} style={{ color: '#32CD32' }} />;
  };

  const filteredAnnouncements = filter === 'all' ? announcements : announcements.filter(a => a.priority === filter);
  const unreadCount = announcements.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Announcements</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Stay updated with university and course announcements</p></div><div className="flex gap-2"><div className="relative"><Bell size={20} style={{ color: colors.textSecondary }} />{unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: colors.error, color: '#fff' }}>{unreadCount}</span>}</div><div className="flex gap-1"><button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-sm transition-all ${filter === 'all' ? 'text-white' : ''}`} style={{ backgroundColor: filter === 'all' ? colors.primary : 'transparent', color: filter === 'all' ? '#000' : colors.textSecondary, border: filter === 'all' ? 'none' : `1px solid ${colors.border}` }}>All</button><button onClick={() => setFilter('high')} className={`px-3 py-1 rounded-lg text-sm transition-all ${filter === 'high' ? 'text-white' : ''}`} style={{ backgroundColor: filter === 'high' ? '#FF4444' : 'transparent', color: filter === 'high' ? '#fff' : colors.textSecondary, border: filter === 'high' ? 'none' : `1px solid ${colors.border}` }}>High</button><button onClick={() => setFilter('medium')} className={`px-3 py-1 rounded-lg text-sm transition-all ${filter === 'medium' ? 'text-white' : ''}`} style={{ backgroundColor: filter === 'medium' ? '#FFD700' : 'transparent', color: filter === 'medium' ? '#000' : colors.textSecondary, border: filter === 'medium' ? 'none' : `1px solid ${colors.border}` }}>Medium</button><button onClick={() => setFilter('low')} className={`px-3 py-1 rounded-lg text-sm transition-all ${filter === 'low' ? 'text-white' : ''}`} style={{ backgroundColor: filter === 'low' ? '#32CD32' : 'transparent', color: filter === 'low' ? '#000' : colors.textSecondary, border: filter === 'low' ? 'none' : `1px solid ${colors.border}` }}>Low</button></div></div></div>
      
      <div className="space-y-3">{filteredAnnouncements.map((ann, idx) => (<motion.div key={ann.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`glass-card p-5 ${!ann.read ? 'ring-1' : ''} hover:scale-102 transition-all cursor-pointer`} style={{ border: `1px solid ${colors.border}`, ringColor: !ann.read ? colors.primary : 'transparent' }}><div className="flex justify-between items-start"><div className="flex items-start gap-3"><div className="mt-1">{getPriorityIcon(ann.priority)}</div><div><div className="flex items-center gap-2 flex-wrap"><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{ann.title}</h3><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{ann.category}</span>{!ann.read && <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-500 animate-pulse">New</span>}</div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{ann.content}</p><div className="flex gap-4 mt-3 text-xs"><span style={{ color: colors.textSubtle }}>📅 {ann.date}</span><span style={{ color: colors.textSubtle }}>👤 {ann.author}</span></div></div></div><button className="text-sm flex items-center gap-1" style={{ color: colors.primary }}><Eye size={14} /> {!ann.read ? 'Mark as read' : 'View'}</button></div></motion.div>))}</div>
    </div>
  );
};

export default AnnouncementsSection;