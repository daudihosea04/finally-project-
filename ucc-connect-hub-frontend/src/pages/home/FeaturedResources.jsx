import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Download, Eye, ArrowRight } from 'lucide-react';

const FeaturedResources = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const resources = [
    { title: 'Complete Study Guide 2026', type: 'PDF Guide', downloads: 1234, views: 5234, icon: '📘' },
    { title: 'Research Paper Template', type: 'Document', downloads: 892, views: 3456, icon: '📄' },
    { title: 'Career Preparation Toolkit', type: 'Resource Pack', downloads: 2100, views: 7890, icon: '💼' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.textPrimary }}>Featured <span style={{ color: colors.primary }}>Resources</span></h2>
            <p className="text-lg" style={{ color: colors.textSecondary }}>Most popular learning materials this week</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onClick={() => navigate('/resources')} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ color: colors.primary, border: `1px solid ${colors.primary}` }}>Browse Library <ArrowRight size={16} /></motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass-card p-5 group hover:scale-105 transition-all" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundCard }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{resource.icon}</div>
                <div>
                  <h3 className="font-bold" style={{ color: colors.textPrimary }}>{resource.title}</h3>
                  <p className="text-xs" style={{ color: colors.textSubtle }}>{resource.type}</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs mb-4">
                <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}><Download size={12} /> {resource.downloads} downloads</div>
                <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}><Eye size={12} /> {resource.views} views</div>
              </div>
              <button className="w-full py-2 rounded-lg font-semibold transition-all" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Access Resource →</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;