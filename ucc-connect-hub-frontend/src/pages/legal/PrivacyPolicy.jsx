import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Lock, Database, Bell, FileText, Mail, Phone, Users, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  const { colors } = useTheme();

  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'UCC Connect Hub collects information you provide directly to us, including: name, email address, student ID, course enrollment data, assignment submissions, chat messages, and notification preferences. All data is collected in compliance with NACTVET guidelines and UDSM data protection policies.'
    },
    {
      icon: Lock,
      title: 'Message Encryption',
      content: 'All messages exchanged on UCC Connect Hub are automatically encrypted using AES-256 encryption before database storage. This ensures that sensitive academic discussions remain confidential and protected from unauthorized access.'
    },
    {
      icon: Database,
      title: 'Data Storage and Security',
      content: 'Your data is stored on secure servers with role-based access control (RBAC). Only authorized users (students, lecturers, or administrators) can access information relevant to their role. We implement regular security audits and virus scanning for all uploaded files.'
    },
    {
      icon: Bell,
      title: 'Notification Channels',
      content: 'UCC Connect Hub uses multi-channel notifications including in-app alerts, push notifications (Firebase Cloud Messaging), SMS (Africa\'s Talking API), and email. You can manage your notification preferences in your profile settings at any time.'
    },
    {
      icon: FileText,
      title: 'Data Retention',
      content: 'Your notification history, assignment submissions, and chat participation records are stored indefinitely for academic auditing and reporting purposes. You have the right to request a comprehensive user report containing all your data.'
    },
    {
      icon: Mail,
      title: 'Contact Information',
      content: 'If you have questions about this Privacy Policy or wish to request your user report, please contact:'
    }
  ];

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <Shield size={48} style={{ color: colors.primary }} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Privacy <span style={{ color: colors.primary }}>Policy</span>
            </h1>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              University of Dar es Salaam Computing Centre (UCC) Dodoma Branch
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSubtle }}>Last updated: June 6, 2026 | Effective: Academic Year 2025/2026</p>
          </div>

          {/* Introduction */}
          <div className="glass-card p-6 mb-8 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <p style={{ color: colors.textSecondary }}>
              UCC Connect Hub ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our supplementary digital communication and collaboration platform.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <section.icon size={24} style={{ color: colors.primary }} />
                  <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{section.title}</h2>
                </div>
                <p style={{ color: colors.textSecondary }}>{section.content}</p>
                {section.title === 'Contact Information' && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                    <p style={{ color: colors.textPrimary }}>📧 privacy@uccconnect.ac.tz</p>
                    <p style={{ color: colors.textPrimary }}>📞 +255 123 456 789</p>
                    <p style={{ color: colors.textPrimary }}>📍 UCC Dodoma Branch, Dodoma, Tanzania</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Role-Based Access Notice */}
          <div className="glass-card p-6 mt-8" style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.primary}` }}>
            <div className="flex items-center gap-3 mb-3">
              <Users size={24} style={{ color: colors.primary }} />
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Role-Based Access Control (RBAC)</h2>
            </div>
            <p style={{ color: colors.textSecondary }}>
              UCC Connect Hub implements strict role-based access control with three user roles:
            </p>
            <ul className="mt-3 space-y-2 ml-6" style={{ color: colors.textSecondary }}>
              <li>• <strong style={{ color: colors.primary }}>Admin:</strong> Full system privileges, user management, analytics access</li>
              <li>• <strong style={{ color: colors.primary }}>Lecturer:</strong> Create assignments, grade submissions, manage groups</li>
              <li>• <strong style={{ color: colors.primary }}>Student:</strong> Submit assignments, join groups, participate in discussions</li>
            </ul>
          </div>

          {/* SMS Fallback Notice */}
          <div className="glass-card p-6 mt-6 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>SMS Fallback for Offline Users</h2>
            <p style={{ color: colors.textSecondary }}>
              To ensure 100% notification coverage, critical academic alerts are delivered via SMS 
              to students without reliable internet connectivity or smartphone devices, promoting 
              inclusive access to education at UCC Dodoma.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSubtle }}>
              © {new Date().getFullYear()} University of Dar es Salaam Computing Centre (UCC) Dodoma. All rights reserved.
              <br />NACTVET Registered | UDSM Accredited Programme
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;