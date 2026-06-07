import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { HelpCircle, Bell, AlertCircle, CheckCircle, MessageCircle, Plus, Search, Trash2, Edit, Eye, Clock, Settings } from 'lucide-react';

const SupportDashboard = () => {
  const { colors } = useTheme();
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  const faqs = [
    { id: 1, question: 'When is the final exam?', answer: 'The final exam is scheduled for March 25th.' },
    { id: 2, question: 'How to submit assignments?', answer: 'Upload your assignment files through the assignment section.' },
    { id: 3, question: 'Where to find grades?', answer: 'Grades are available in the Grade Analytics section.' },
  ];

  const notifications = [
    { id: 1, message: 'New submission from John Doe', time: '2 minutes ago', read: false, type: 'submission' },
    { id: 2, message: 'Assignment deadline tomorrow', time: '1 hour ago', read: false, type: 'reminder' },
    { id: 3, message: 'Student question posted', time: '3 hours ago', read: true, type: 'question' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Support & Notifications</h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Manage FAQs and receive real-time alerts</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Real-Time Notifications</h2><Bell size={18} style={{ color: colors.primary }} /></div>
          <div className="space-y-2 max-h-80 overflow-y-auto">{notifications.map(notif => (<div key={notif.id} className={`p-3 rounded-lg flex items-start gap-3 ${!notif.read ? 'ring-1' : ''}`} style={{ backgroundColor: `${colors.primary}05`, ringColor: colors.primary }}><div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`}></div><div><p style={{ color: colors.textPrimary }}>{notif.message}</p><p className="text-xs mt-1" style={{ color: colors.textSubtle }}>{notif.time}</p></div></div>))}</div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Quick Support</h2><div className="space-y-3"><button className="w-full p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.primary}10` }}><MessageCircle size={18} style={{ color: colors.primary }} /><span style={{ color: colors.textPrimary }}>Contact IT Support</span></button><button className="w-full p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.secondary}10` }}><Settings size={18} style={{ color: colors.secondary }} /><span style={{ color: colors.textPrimary }}>System Settings</span></button><button className="w-full p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.primary}10` }}><AlertCircle size={18} style={{ color: colors.error }} /><span style={{ color: colors.textPrimary }}>Report Issue</span></button></div></div>
      </div>

      {/* FAQ Management */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>FAQ Management</h2><button className="text-sm flex items-center gap-1" style={{ color: colors.primary }}><Plus size={14} /> Add FAQ</button></div>
        <div className="space-y-3 max-h-64 overflow-y-auto">{faqs.map(faq => (<div key={faq.id} className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div className="flex justify-between items-start"><h3 className="font-medium" style={{ color: colors.textPrimary }}>❓ {faq.question}</h3><div className="flex gap-2"><Edit size={14} style={{ color: colors.primary }} /><Trash2 size={14} style={{ color: colors.error }} /></div></div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{faq.answer}</p></div>))}</div>
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-sm" style={{ color: colors.textSecondary }}>💡 Tip: Add frequently asked questions to reduce repetitive inquiries from students.</p></div>
      </div>
    </div>
  );
};

export default SupportDashboard;