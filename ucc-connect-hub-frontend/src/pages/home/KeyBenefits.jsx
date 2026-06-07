import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { MessageCircle, Users, Calendar, FolderOpen, Zap, Shield } from 'lucide-react';

const KeyBenefits = () => {
  const { colors } = useTheme();
  const benefits = [
    { icon: MessageCircle, title: 'Seamless Communication', desc: 'Real-time messaging and notifications' },
    { icon: Users, title: 'Collaboration Tools', desc: 'Group projects and study rooms' },
    { icon: Calendar, title: 'Event Access', desc: 'Webinars, workshops, and campus events' },
    { icon: FolderOpen, title: 'Resource Library', desc: 'Thousands of free learning materials' },
    { icon: Zap, title: 'Smart Analytics', desc: 'Track your progress and engagement' },
    { icon: Shield, title: 'Secure Platform', desc: 'Your data is always protected' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>Why Students <span style={{ color: colors.primary }}>Love UCC Connect Hub</span></h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>Discover the benefits that make our platform the #1 choice for UCC community</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="flex gap-4 p-4 rounded-lg hover:scale-105 transition-all" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
              <benefit.icon size={28} style={{ color: colors.primary }} className="flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>{benefit.title}</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;