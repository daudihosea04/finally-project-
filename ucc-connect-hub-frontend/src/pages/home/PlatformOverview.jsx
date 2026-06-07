import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { MessageCircle, Share2, FileText, Calendar, Users, Award, Bell, Lock, Video, ClipboardList, TrendingUp, Shield } from 'lucide-react';

const PlatformOverview = () => {
  const { colors } = useTheme();
  
  const features = [
    { icon: MessageCircle, title: 'Real-Time Group Chat', desc: 'Instant messaging with WebSocket technology for seamless communication' },
    { icon: ClipboardList, title: 'Assignment Management', desc: 'Create, submit, and grade assignments with automatic deadline enforcement' },
    { icon: Lock, title: 'Message Encryption', desc: 'AES-256 encrypted messages for secure academic discussions' },
    { icon: Bell, title: 'Multi-Channel Notifications', desc: 'In-app, push, SMS, and email alerts for important updates' },
    { icon: Video, title: 'Virtual Rooms', desc: 'Scheduled online classrooms for lectures and discussions' },
    { icon: Share2, title: 'File Sharing', desc: 'Upload and share PDFs, documents, images with virus scanning' },
    { icon: Users, title: 'Role-Based Access', desc: 'Student, Lecturer, and Admin roles with appropriate permissions' },
    { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Real-time statistics on users, messages, and submissions' },
    { icon: Award, title: 'User Reports', desc: 'Comprehensive reports for academic auditing and compliance' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>Platform <span style={{ color: colors.primary }}>Features</span></h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
            UCC Connect Hub provides comprehensive tools for academic collaboration,
            designed specifically for UCC Dodoma's unique requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass-card p-6 group hover:scale-105 transition-all duration-300" style={{ border: `1px solid ${colors.border}` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${colors.primary}20`, border: `1px solid ${colors.border}` }}>
                <feature.icon size={28} style={{ color: colors.primary }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{feature.title}</h3>
              <p style={{ color: colors.textSecondary }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;