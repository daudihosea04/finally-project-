import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { User, Mail, Phone, Calendar, Briefcase, Edit2, Save, X, Camera } from 'lucide-react';

const MyProfileSection = () => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Daniel',
    lastName: 'James',
    username: 'admin',
    email: 'danieljames@gmail.com',
    phone: '10059671104',
    skill: 'Instructor',
    bio: "Hi, I'm Daniel James and I teach a bit of everything. Let me to share a little about myself — Teaching is my passion and I've been in the profession for 5 years. For the first three years of my career, I taught at Rock Hill College. Then, during my fourth year I decided to start teaching online because I wanted the freedom to teach a variety of subjects. And the rest has been history since.",
    registrationDate: 'October 20, 2022 5:12 am'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Profile</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Manage your personal information</p></div><button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: isEditing ? '#32CD32' : colors.primary, color: '#000' }}>{isEditing ? <Save size={16} /> : <Edit2 size={16} />}{isEditing ? 'Save Changes' : 'Edit Profile'}</button></div>
      
      <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex flex-col md:flex-row gap-8"><div className="text-center"><div className="relative inline-block"><div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl" style={{ backgroundColor: `${colors.primary}20` }}>👨‍🏫</div><button className="absolute bottom-0 right-0 p-2 rounded-full" style={{ backgroundColor: colors.primary }}><Camera size={16} style={{ color: '#000' }} /></button></div><div className="mt-3"><div className="flex items-center justify-center gap-1"><span className="text-xl">⭐</span><span className="text-lg font-bold" style={{ color: colors.primary }}>4.26</span><span className="text-sm" style={{ color: colors.textSecondary }}>(19 Ratings)</span></div></div></div>
          
          <div className="flex-1"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Registration Date</label><p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.registrationDate}</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"><div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>First Name</label>{isEditing ? <input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.firstName}</p>}</div>
          <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Last Name</label>{isEditing ? <input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.lastName}</p>}</div>
          <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Username</label><p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.username}</p></div>
          <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Email</label>{isEditing ? <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.email}</p>}</div>
          <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Phone Number</label>{isEditing ? <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.phone}</p>}</div>
          <div className="md:col-span-2"><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Skill/Occupation</label>{isEditing ? <input type="text" value={profile.skill} onChange={(e) => setProfile({...profile, skill: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textPrimary }}>{profile.skill}</p>}</div>
          <div className="md:col-span-2"><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Biography</label>{isEditing ? <textarea rows={4} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="input-field w-full mt-1" style={{ border: `1px solid ${colors.border}` }} /> : <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{profile.bio}</p>}</div></div></div></div>
      </div>
    </div>
  );
};

export default MyProfileSection;