import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Send, Users } from 'lucide-react';

const BulkMessaging = ({ selectedCourse }) => {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  return (
    <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Bulk Messaging</h2>
      <p style={{ color: colors.textSecondary }}>Send messages to all students in {selectedCourse}</p>
      <div className="mt-4"><textarea rows={3} placeholder="Type your message here..." className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={message} onChange={(e) => setMessage(e.target.value)} /></div>
      <button className="mt-3 w-full py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Send size={16} /> Send to All Students</button>
    </div>
  );
};

export default BulkMessaging;