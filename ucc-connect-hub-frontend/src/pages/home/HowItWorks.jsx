import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { UserPlus, Users, BookOpen, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const { colors, isDark } = useTheme();
  const steps = [
    { icon: UserPlus, title: 'Join the Community', desc: 'Create your free account in 30 seconds', number: '01' },
    { icon: Users, title: 'Connect & Collaborate', desc: 'Find peers, mentors, and study groups', number: '02' },
    { icon: BookOpen, title: 'Access & Grow', desc: 'Start learning and sharing resources', number: '03' }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>How <span style={{ color: colors.primary }}>UCC Connect Hub</span> Works</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>Get started in three simple steps and transform your learning experience</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {index < steps.length - 1 && <ArrowRight className="hidden md:block absolute top-1/3 -right-6 transform -translate-y-1/2" size={32} style={{ color: colors.primary }} />}
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 relative" style={{ backgroundColor: `${colors.primary}20`, border: `2px solid ${colors.primary}` }}>
                <step.icon size={40} style={{ color: colors.primary }} />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.primary, color: isDark ? '#000' : '#fff' }}>{step.number}</div>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>{step.title}</h3>
              <p style={{ color: colors.textSecondary }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;