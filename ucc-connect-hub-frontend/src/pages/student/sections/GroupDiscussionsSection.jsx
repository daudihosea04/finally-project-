import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Users, Send, Plus, Search, ChevronRight, MessageCircle } from 'lucide-react';

const GroupDiscussionsSection = () => {
  const { colors } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  
  const groups = [
    { id: 1, name: 'Web Dev Study Group', members: 8, unread: 3, lastMessage: 'Anyone free for discussion?', lastTime: '5 min ago', description: 'Discuss web development concepts and projects' },
    { id: 2, name: 'Database Project Team', members: 5, unread: 0, lastMessage: 'Great work everyone!', lastTime: '2 hours ago', description: 'Group project collaboration for Database Systems' },
    { id: 3, name: 'Algorithms Practice', members: 12, unread: 2, lastMessage: 'Solution for problem 3?', lastTime: '1 day ago', description: 'Practice algorithms and data structures together' },
  ];
  
  const groupMessages = [
    { id: 1, user: 'John Doe', avatar: '👨‍🎓', message: 'Has anyone started the group project?', time: '10:30 AM', isMe: false },
    { id: 2, user: 'Jane Smith', avatar: '👩‍🎓', message: 'Yes, I\'ve started working on the database design.', time: '10:32 AM', isMe: false },
    { id: 3, user: 'Me', message: 'I can help with the frontend part.', time: '10:35 AM', isMe: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Group Discussions</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Collaborate with peers in study groups and project teams</p></div><button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Create Group</button></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="glass-card overflow-hidden flex flex-col" style={{ border: `1px solid ${colors.border}` }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search groups..." className="w-full pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} /></div></div>
          <div className="flex-1 overflow-y-auto">{groups.map((group) => (<div key={group.id} onClick={() => setSelectedGroup(group)} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-opacity-10 transition-all ${selectedGroup?.id === group.id ? `bg-opacity-10` : ''}`} style={{ backgroundColor: selectedGroup?.id === group.id ? `${colors.primary}10` : 'transparent', borderBottom: `1px solid ${colors.border}` }}><div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${colors.primary}20` }}>👥</div><div className="flex-1"><div className="flex justify-between"><span className="font-medium" style={{ color: colors.textPrimary }}>{group.name}</span><span className="text-xs" style={{ color: colors.textSubtle }}>{group.lastTime}</span></div><p className="text-xs mt-0.5" style={{ color: group.unread > 0 ? colors.primary : colors.textSubtle }}>{group.lastMessage}</p><div className="flex gap-2 mt-1"><span className="text-xs" style={{ color: colors.textSubtle }}><Users size={10} className="inline mr-1" />{group.members} members</span></div></div>{group.unread > 0 && <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colors.primary, color: '#000' }}>{group.unread}</div>}</div>))}</div>
        </div>
        
        <div className="lg:col-span-2 glass-card flex flex-col" style={{ border: `1px solid ${colors.border}` }}>
          {selectedGroup ? (
            <>
              <div className="p-4 border-b" style={{ borderColor: colors.border }}><div className="flex justify-between items-center"><div><div className="font-bold text-lg" style={{ color: colors.textPrimary }}>{selectedGroup.name}</div><p className="text-xs" style={{ color: colors.textSecondary }}>{selectedGroup.description}</p></div><div className="flex gap-2"><button className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Users size={14} className="inline mr-1" /> {selectedGroup.members} Members</button></div></div></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">{groupMessages.map((msg, idx) => (<div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] ${!msg.isMe ? 'flex items-start gap-2' : ''}`}>{!msg.isMe && <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${colors.primary}20` }}>{msg.avatar}</div>}<div className={`p-3 rounded-lg ${msg.isMe ? 'rounded-br-none' : 'rounded-bl-none'}`} style={{ backgroundColor: msg.isMe ? colors.primary : `${colors.primary}10`, color: msg.isMe ? '#000' : colors.textPrimary }}><p className="text-sm">{msg.message}</p><div className={`text-xs mt-1 ${msg.isMe ? 'text-black/70' : 'text-gray-500'}`}>{msg.time}</div></div></div></div>))}</div>
              <div className="p-4 border-t" style={{ borderColor: colors.border }}><div className="flex gap-2"><input type="text" placeholder={`Message #${selectedGroup.name}`} className="flex-1 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && messageInput.trim() && setMessageInput('')} /><button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!messageInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ backgroundColor: colors.primary, color: '#000' }} disabled={!messageInput.trim()}><Send size={16} /> Send</button></div></div>
            </>
          ) : (<div className="flex-1 flex items-center justify-center"><div className="text-center"><MessageCircle size={48} style={{ color: colors.textSubtle }} className="mx-auto mb-3" /><p style={{ color: colors.textSecondary }}>Select a group to join the discussion</p></div></div>)}
        </div>
      </div>
    </div>
  );
};

export default GroupDiscussionsSection;