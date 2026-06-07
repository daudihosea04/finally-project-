import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Send, Paperclip, Smile, Phone, Video, Search, MoreVertical, MessageCircle } from 'lucide-react';

const ChatSection = () => {
  const { colors } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  
  const conversations = [
    { id: 1, name: 'John Doe', avatar: '👨‍🎓', lastMessage: 'Hey, have you started the React project?', time: '10:30 AM', unread: 2, online: true, typing: false },
    { id: 2, name: 'Jane Smith', avatar: '👩‍🎓', lastMessage: 'Yes, working on it. Need help?', time: '9:15 AM', unread: 0, online: true, typing: true },
    { id: 3, name: 'Mike Johnson', avatar: '👨‍🎓', lastMessage: 'Can we study together for the exam?', time: 'Yesterday', unread: 0, online: false, typing: false },
    { id: 4, name: 'Sarah Williams', avatar: '👩‍🎓', lastMessage: 'Thanks for your help!', time: 'Yesterday', unread: 0, online: true, typing: false },
  ];
  
  const messages = [
    { id: 1, sender: 'John Doe', message: 'Hey! How are you doing?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Me', message: 'I\'m good, thanks! Working on the React project.', time: '10:31 AM', isMe: true },
    { id: 3, sender: 'John Doe', message: 'Same here. Have you finished the API integration?', time: '10:32 AM', isMe: false },
    { id: 4, sender: 'Me', message: 'Almost done! Just need to test the endpoints.', time: '10:33 AM', isMe: true },
    { id: 5, sender: 'John Doe', message: 'Great! Want to collaborate on the frontend part?', time: '10:34 AM', isMe: false },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Messages</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Private one-to-one chat with fellow students</p></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <div className="glass-card flex flex-col overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
          <div className="p-4 border-b" style={{ borderColor: colors.border }}><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} /></div></div>
          <div className="flex-1 overflow-y-auto">{conversations.map((conv) => (<div key={conv.id} onClick={() => setSelectedChat(conv)} className={`flex items-center gap-3 p-3 cursor-pointer hover:scale-102 transition-all ${selectedChat?.id === conv.id ? 'bg-opacity-10' : ''}`} style={{ backgroundColor: selectedChat?.id === conv.id ? `${colors.primary}10` : 'transparent', borderBottom: `1px solid ${colors.border}` }}><div className="relative"><div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${colors.primary}20` }}>{conv.avatar}</div>{conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 animate-pulse" style={{ borderColor: colors.background }}></div>}</div><div className="flex-1"><div className="flex justify-between"><span className="font-medium" style={{ color: colors.textPrimary }}>{conv.name}</span><span className="text-xs" style={{ color: colors.textSubtle }}>{conv.time}</span></div><p className="text-xs mt-0.5" style={{ color: conv.unread > 0 ? colors.primary : colors.textSubtle }}>{conv.typing ? <span className="text-primary italic">typing...</span> : conv.lastMessage}</p></div>{conv.unread > 0 && <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-pulse" style={{ backgroundColor: colors.primary, color: '#000' }}>{conv.unread}</div>}</div>))}</div>
        </div>
        
        {/* Chat Area */}
        <div className="lg:col-span-2 glass-card flex flex-col" style={{ border: `1px solid ${colors.border}` }}>
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: `${colors.primary}20` }}>{selectedChat.avatar}</div><div><div className="font-medium" style={{ color: colors.textPrimary }}>{selectedChat.name}</div><div className="text-xs" style={{ color: selectedChat.online ? '#32CD32' : colors.textSubtle }}>{selectedChat.online ? 'Online' : 'Offline'}</div></div></div><div className="flex gap-2"><button className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.primary }}><Phone size={18} /></button><button className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.primary }}><Video size={18} /></button><button className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.primary }}><MoreVertical size={18} /></button></div></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">{messages.map((msg) => (<div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-lg ${msg.isMe ? 'rounded-br-none' : 'rounded-bl-none'} hover:scale-102 transition-all`} style={{ backgroundColor: msg.isMe ? colors.primary : `${colors.primary}10`, color: msg.isMe ? '#000' : colors.textPrimary }}><p className="text-sm">{msg.message}</p><div className={`text-xs mt-1 ${msg.isMe ? 'text-black/70' : 'text-gray-500'}`}>{msg.time}</div></div></div>))}</div>
              <div className="p-4 border-t" style={{ borderColor: colors.border }}><div className="flex gap-2"><button className="p-2 rounded-lg hover:scale-105 transition" style={{ color: colors.primary }}><Paperclip size={18} /></button><button className="p-2 rounded-lg hover:scale-105 transition" style={{ color: colors.primary }}><Smile size={18} /></button><input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 rounded-lg transition-all focus:scale-102" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} /><button onClick={handleSendMessage} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 ${!messageInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ backgroundColor: colors.primary, color: '#000' }} disabled={!messageInput.trim()}><Send size={16} /> Send</button></div></div>
            </>
          ) : (<div className="flex-1 flex items-center justify-center"><div className="text-center"><MessageCircle size={48} style={{ color: colors.textSubtle }} className="mx-auto mb-3" /><p style={{ color: colors.textSecondary }}>Select a conversation to start chatting</p></div></div>)}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;