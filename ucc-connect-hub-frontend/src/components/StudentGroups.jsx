import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LiveChat from './LiveChat';  // ← HII BADALA YA require

const StudentGroups = ({ colors, user }) => {
  const [myGroups, setMyGroups] = useState([
    { id: 1, name: 'Web Dev Study Group', members: 8, description: 'Discuss web development concepts and projects', course: 'Web Development', icon: '💻', joined: true },
    { id: 2, name: 'Database Project Team', members: 5, description: 'Group project collaboration for Database Systems', course: 'Database Systems', icon: '🗄️', joined: true },
    { id: 3, name: 'Algorithms Practice', members: 12, description: 'Practice algorithms and data structures together', course: 'Data Structures', icon: '📊', joined: false },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const handleJoinGroup = (groupId) => {
    setMyGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, joined: true } : g
    ));
    alert('You have joined the group!');
  };
  
  const handleLeaveGroup = (groupId) => {
    setMyGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, joined: false } : g
    ));
    setSelectedGroup(null);
    alert('You have left the group');
  };
  
  if (selectedGroup) {
    return (
      <div className="h-[calc(100vh-200px)]">
        <button onClick={() => setSelectedGroup(null)} className="mb-4 flex items-center gap-2 text-sm" style={{ color: colors.primary }}>
          ← Back to Groups
        </button>
        <LiveChat groupId={selectedGroup.id} courseName={selectedGroup.name} colors={colors} user={user} />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {myGroups.map(group => (
        <div key={group.id} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{group.icon}</div>
            <div>
              <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>{group.name}</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{group.course}</p>
            </div>
          </div>
          <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>{group.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: colors.textSubtle }}>👥 {group.members} members</span>
            {group.joined ? (
              <div className="flex gap-2">
                <button onClick={() => setSelectedGroup(group)} className="px-4 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Open Chat</button>
                <button onClick={() => handleLeaveGroup(group.id)} className="px-4 py-1 rounded text-sm" style={{ border: `1px solid ${colors.border}`, color: colors.textSecondary }}>Leave</button>
              </div>
            ) : (
              <button onClick={() => handleJoinGroup(group.id)} className="px-4 py-1 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Join Group</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentGroups;