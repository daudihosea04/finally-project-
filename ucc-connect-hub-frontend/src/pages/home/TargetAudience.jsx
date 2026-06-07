import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { GraduationCap, Users, Award, Briefcase, ArrowRight } from 'lucide-react';

const TargetAudience = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const audiences = [
    { icon: GraduationCap, title: 'Students', desc: 'Access courses, resources, and connect with peers', color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
    { icon: Users, title: 'Faculty & Staff', desc: 'Share resources, manage courses, engage with students', color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' },
    { icon: Award, title: 'Alumni', desc: 'Stay connected, mentor students, share opportunities', color: '#32CD32', bg: 'rgba(50,205,50,0.1)' },
    { icon: Briefcase, title: 'Industry Partners', desc: 'Recruit talent, offer internships, collaborate', color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)' }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>Designed for <span style={{ color: colors.primary }}>Everyone</span> at UCC</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>Whether you're a student, faculty member, alumni, or industry partner - there's a place for you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundCard }} onClick={() => navigate('/register')}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: audience.bg, border: `2px solid ${audience.color}` }}>
                <audience.icon size={36} style={{ color: audience.color }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{audience.title}</h3>
              <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>{audience.desc}</p>
              <button className="text-sm font-semibold flex items-center justify-center gap-1 group-hover:gap-2 transition-all" style={{ color: colors.primary }}>Join Now <ArrowRight size={14} /></button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;