import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Users, Send, Plus, Search, ChevronRight, MessageCircle, UserPlus } from 'lucide-react';

const GroupsSection = () => {
  const { colors } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const groups = [
    { id: 1, name: 'Web Dev Study Group', members: 8, unread: 3, lastMessage: 'Anyone free for discussion?', lastTime: '5 min ago', description: 'Discuss web development concepts and projects', icon: '💻', joined: true },
    { id: 2, name: 'Database Project Team', members: 5, unread: 0, lastMessage: 'Great work everyone!', lastTime: '2 hours ago', description: 'Group project collaboration for Database Systems', icon: '🗄️', joined: true },
    { id: 3, name: 'Algorithms Practice', members: 12, unread: 2, lastMessage: 'Solution for problem 3?', lastTime: '1 day ago', description: 'Practice algorithms and data structures together', icon: '📊', joined: false },
    { id: 4, name: 'AI Study Circle', members: 15, unread: 1, lastMessage: 'Anyone attending the AI guest lecture?', lastTime: '3 hours ago', description: 'Discussion about AI and machine learning', icon: '🤖', joined: false },
  ];

  const groupMessages = [
    { id: 1, user: 'John Doe', avatar: '👨‍🎓', message: 'Has anyone started the group project?', time: '10:30 AM', isMe: false },
    { id: 2, user: 'Jane Smith', avatar: '👩‍🎓', message: 'Yes, I\'ve started working on the database design.', time: '10:32 AM', isMe: false },
    { id: 3, user: 'Me', message: 'I can help with the frontend part.', time: '10:35 AM', isMe: true },
    { id: 4, user: 'Mike Johnson', avatar: '👨‍🎓', message: 'Great! Let\'s schedule a meeting.', time: '10:38 AM', isMe: false },
  ];

  const handleJoinGroup = (groupId) => {
    alert(`You have joined the group!`);
    // Update group status
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert(`Message sent: ${messageInput}`);
      setMessageInput('');
    }
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Group Discussions</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Join study groups and collaborate with peers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Groups List - Students can only view and join */}
        <div className="glass-card flex flex-col overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type="text" 
                placeholder="Search groups..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm" 
                style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div 
                key={group.id} 
                onClick={() => setSelectedGroup(group)} 
                className={`flex items-center gap-3 p-3 cursor-pointer hover:scale-102 transition-all ${selectedGroup?.id === group.id ? 'bg-opacity-10' : ''}`} 
                style={{ backgroundColor: selectedGroup?.id === group.id ? `${colors.primary}10` : 'transparent', borderBottom: `1px solid ${colors.border}` }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${colors.primary}20` }}>
                  {group.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium" style={{ color: colors.textPrimary }}>{group.name}</span>
                    <span className="text-xs" style={{ color: colors.textSubtle }}>{group.lastTime}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: group.unread > 0 ? colors.primary : colors.textSubtle }}>
                    {group.lastMessage}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs flex items-center gap-1" style={{ color: colors.textSubtle }}>
                      <Users size={10} /> {group.members} members
                    </span>
                  </div>
                </div>
                {group.unread > 0 && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-pulse" style={{ backgroundColor: colors.primary, color: '#000' }}>
                    {group.unread}
                  </div>
                )}
                {!group.joined && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id); }} 
                    className="px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: colors.primary, color: '#000' }}
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area - Only shows when group is selected */}
        <div className="lg:col-span-2 glass-card flex flex-col" style={{ border: `1px solid ${colors.border}` }}>
          {selectedGroup ? (
            <>
              <div className="p-4 border-b" style={{ borderColor: colors.border }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg" style={{ color: colors.textPrimary }}>{selectedGroup.name}</div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{selectedGroup.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                      {selectedGroup.members} members
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {groupMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${!msg.isMe ? 'flex items-start gap-2' : ''}`}>
                      {!msg.isMe && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${colors.primary}20` }}>
                          {msg.avatar}
                        </div>
                      )}
                      <div className={`p-3 rounded-lg ${msg.isMe ? 'rounded-br-none' : 'rounded-bl-none'} hover:scale-102 transition-all`} style={{ backgroundColor: msg.isMe ? colors.primary : `${colors.primary}10`, color: msg.isMe ? '#000' : colors.textPrimary }}>
                        {!msg.isMe && <div className="text-xs font-bold mb-1" style={{ color: colors.primary }}>{msg.user}</div>}
                        <p className="text-sm">{msg.message}</p>
                        <div className={`text-xs mt-1 ${msg.isMe ? 'text-black/70' : 'text-gray-500'}`}>{msg.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t" style={{ borderColor: colors.border }}>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={`Message #${selectedGroup.name}`} 
                    className="flex-1 px-4 py-2 rounded-lg transition-all focus:scale-102" 
                    style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} 
                    value={messageInput} 
                    onChange={(e) => setMessageInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  />
                  <button 
                    onClick={handleSendMessage} 
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 ${!messageInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    style={{ backgroundColor: colors.primary, color: '#000' }} 
                    disabled={!messageInput.trim()}
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} style={{ color: colors.textSubtle }} className="mx-auto mb-3" />
                <p style={{ color: colors.textSecondary }}>Select a group to join the discussion</p>
                <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>Browse and join study groups above</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsSection;