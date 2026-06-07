import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Play, ArrowRight, LogIn, Users, BookOpen, Calendar, Shield, Zap } from 'lucide-react';

const HeroSection = ({ setShowVideo }) => {
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto text-center">
          
          {/* UCC Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-block mb-6 px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, border: `1px solid ${colors.border}` }}>
            🎓 University of Dar es Salaam Computing Centre | UCC Dodoma
          </motion.div>

          {/* Headline */}
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: colors.textPrimary }}>
            <span style={{ color: colors.primary }}>UCC Connect Hub</span>
            <br />
            Bridging Communication & Collaboration
          </motion.h1>

          {/* Tagline */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: colors.textSecondary }}>
            A supplementary digital communication and collaboration platform for UCC Dodoma,
            providing real-time messaging, project workspaces, assignment management, and 
            multi-channel notifications for students, lecturers, and administrators.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-lg text-lg font-bold transition-all flex items-center justify-center gap-2 group" style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: isDark ? '#000' : '#fff', boxShadow: `0 4px 15px ${colors.primary}40` }}>
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2" style={{ border: `2px solid ${colors.primary}`, color: colors.primary, background: 'transparent' }}>
              <LogIn size={20} /> Sign In
            </button>
            <button onClick={() => setShowVideo(true)} className="px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2" style={{ border: `2px solid ${colors.border}`, color: colors.textSecondary, background: 'transparent' }}>
              <Play size={20} /> Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { icon: Users, value: '50+', label: 'Active Students' },
              { icon: BookOpen, value: '2', label: 'Programmes' },
              { icon: Calendar, value: '2', label: 'Intakes/Year' },
              { icon: Shield, value: 'NACTVET', label: 'Accredited' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.border}` }}>
                <stat.icon size={24} style={{ color: colors.primary }} />
                <div><div className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-xs" style={{ color: colors.textSubtle }}>{stat.label}</div></div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;