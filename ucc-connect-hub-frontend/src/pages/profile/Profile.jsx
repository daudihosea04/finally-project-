import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, 
  Award, Clock, Edit2, Save, X, Camera, 
  Lock, Bell, Shield, Globe, ChevronRight, Users
} from 'lucide-react';

const Profile = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Prof. Johnson',
    email: user?.email || 'lecturer@ucc.ac.tz',
    phone: '+255 123 456 789',
    department: 'Computer Science',
    designation: 'Senior Lecturer',
    employeeId: 'UCC/2024/LEC001',
    joinDate: '2020-01-15',
    bio: 'Experienced educator passionate about technology and student success. Specializing in web development and database systems.',
    officeHours: 'Monday & Wednesday, 2:00 PM - 4:00 PM',
    officeLocation: 'Science Building, Room 301'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const stats = [
    { icon: BookOpen, label: 'Courses Taught', value: '8', color: '#FFD700' },
    { icon: Award, label: 'Certifications', value: '12', color: '#00E5FF' },
    { icon: Users, label: 'Students Mentored', value: '245', color: '#32CD32' },
    { icon: Clock, label: 'Years Experience', value: '8+', color: '#FF6B6B' },
  ];

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>My Profile</h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Manage your personal information and preferences</p>
        </motion.div>

        {/* Profile Overview Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: `${colors.primary}20` }}>
                👨‍🏫
              </div>
              <button className="absolute bottom-0 right-0 p-1 rounded-full" style={{ backgroundColor: colors.primary }}>
                <Camera size={14} style={{ color: '#000' }} />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formData.fullName}</h2>
              <p className="text-sm" style={{ color: colors.primary }}>{formData.designation} • {formData.department}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}><Mail size={14} /> {formData.email}</div>
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}><Phone size={14} /> {formData.phone}</div>
                <div className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}><Calendar size={14} /> Joined {formData.joinDate}</div>
              </div>
            </div>
            
            {/* Edit Button */}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: isEditing ? '#32CD32' : colors.primary, color: isEditing ? '#000' : '#000' }}
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={20} style={{ color: stat.color }} /></div>
              <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'academic', label: 'Academic', icon: BookOpen },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent', color: activeTab === tab.id ? colors.primary : colors.textSecondary }}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Full Name</label>{isEditing ? <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.fullName}</p>}</div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address</label>{isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.email}</p>}</div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Phone Number</label>{isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.phone}</p>}</div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Department</label>{isEditing ? <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.department}</p>}</div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Designation</label>{isEditing ? <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.designation}</p>}</div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Employee ID</label><p style={{ color: colors.textPrimary }}>{formData.employeeId}</p></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Bio</label>{isEditing ? <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} /> : <p style={{ color: colors.textPrimary }}>{formData.bio}</p>}</div>
            </div>
          </motion.div>
        )}

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Office Hours</label><p style={{ color: colors.textPrimary }}>{formData.officeHours}</p></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Office Location</label><p style={{ color: colors.textPrimary }}>{formData.officeLocation}</p></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Research Interests</label><div className="flex flex-wrap gap-2"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Web Development</span><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Database Systems</span><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Machine Learning</span></div></div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>Email Notifications</div><div className="text-xs" style={{ color: colors.textSecondary }}>Receive email alerts for new submissions</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: colors.primary }}></div></label></div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>SMS Notifications</div><div className="text-xs" style={{ color: colors.textSecondary }}>Receive SMS for urgent announcements</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: colors.border }}></div></label></div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>Push Notifications</div><div className="text-xs" style={{ color: colors.textSecondary }}>Receive browser notifications</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: colors.primary }}></div></label></div>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="space-y-4">
              <button className="w-full p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}05` }}><span style={{ color: colors.textPrimary }}>Change Password</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
              <button className="w-full p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}05` }}><span style={{ color: colors.textPrimary }}>Two-Factor Authentication</span><ChevronRight size={16} style={{ color: colors.primary }} /></button>
              <button className="w-full p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.error}10` }}><span style={{ color: colors.error }}>Session Management</span><ChevronRight size={16} style={{ color: colors.error }} /></button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;