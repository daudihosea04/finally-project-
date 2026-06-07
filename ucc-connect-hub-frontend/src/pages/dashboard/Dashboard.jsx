import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

const Dashboard = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '4', color: '#FFD700' },
    { icon: Users, label: 'Study Groups', value: '2', color: '#00E5FF' },
    { icon: Calendar, label: 'Upcoming Events', value: '3', color: '#32CD32' },
    { icon: Award, label: 'Certificates', value: '2', color: '#FF6B6B' },
  ];

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="mb-8" style={{ color: colors.textSecondary }}>Here's what's happening with your learning journey.</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
                style={{ border: `1px solid ${colors.border}` }}
              >
                <stat.icon size={40} style={{ color: stat.color }} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>{stat.value}</div>
                <div style={{ color: colors.textSecondary }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Recent Activity</h2>
            <div className="space-y-3">
              {[
                { activity: 'Completed Module 3 of Web Development', time: '2 hours ago' },
                { activity: 'Submitted Physics Assignment', time: '1 day ago' },
                { activity: 'Joined Study Group: Data Science', time: '2 days ago' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.border }}>
                  <span style={{ color: colors.textSecondary }}>{item.activity}</span>
                  <span className="text-xs" style={{ color: colors.textSubtle }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;