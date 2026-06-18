import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LiveChat from './LiveChat';
import ChatComponent from './ChatComponent';

const StudentChat = ({ enrolledCourses, colors, user }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chatType, setChatType] = useState('course');

  if (!selectedCourse && chatType === 'course') {
    return (
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Chat</h2>
        <p className="mb-4" style={{ color: colors.textSecondary }}>Select a course to start chatting with your instructor and classmates</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map(course => (
            <div key={course.id} className="p-4 rounded-lg cursor-pointer hover:scale-102 transition-all" 
                 style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}
                 onClick={() => setSelectedCourse(course)}>
              <div className="text-4xl mb-2">{course.image}</div>
              <h3 className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code}</p>
              <button className="mt-3 px-3 py-1 rounded text-sm" 
                      style={{ backgroundColor: colors.primary, color: '#000' }}>
                Open Chat
              </button>
            </div>
          ))}
        </div>
        <hr className="my-6" style={{ borderColor: colors.border }} />
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold" style={{ color: colors.textPrimary }}>Private Chat</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Chat directly with your lecturer</p>
          </div>
          <button onClick={() => { setChatType('private'); setSelectedCourse({ id: 0, title: 'Lecturer Chat', code: 'PRIVATE' }); }} 
                  className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>
            Message Lecturer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <button onClick={() => { setSelectedCourse(null); setChatType('course'); }} 
              className="mb-4 flex items-center gap-2 text-sm" style={{ color: colors.primary }}>
        ← Back to Chat Selection
      </button>
      {chatType === 'private' ? (
        <ChatComponent receiverId={2} receiverName="Lecturer" type="user" />
      ) : (
        <LiveChat courseId={selectedCourse.id} courseName={selectedCourse.title} colors={colors} user={user} />
      )}
    </div>
  );
};

export default StudentChat;