import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const { colors } = useTheme();
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Computer Science Student', text: 'UCC Connect Hub transformed my learning experience! I found study groups, accessed resources, and even landed an internship.', rating: 5, image: '👩‍💻' },
    { name: 'Prof. Michael Chen', role: 'Mathematics Faculty', text: 'The platform makes it so easy to share resources and engage with students. It\'s revolutionized how I teach.', rating: 5, image: '👨‍🏫' },
    { name: 'James Mwangi', role: 'Alumni', text: 'Staying connected has never been easier. I mentor students and share job opportunities regularly.', rating: 5, image: '👨‍🎓' }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>Success <span style={{ color: colors.primary }}>Stories</span></h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>Hear what our community members have to say about UCC Connect Hub</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass-card p-6 relative" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundCard }}>
              <Quote size={40} style={{ color: `${colors.primary}30` }} className="absolute bottom-4 right-4" />
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <div className="font-bold" style={{ color: colors.textPrimary }}>{testimonial.name}</div>
                  <div className="text-sm" style={{ color: colors.textSubtle }}>{testimonial.role}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} size={16} fill={colors.primary} style={{ color: colors.primary }} />))}
              </div>
              <p style={{ color: colors.textSecondary }}>"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;