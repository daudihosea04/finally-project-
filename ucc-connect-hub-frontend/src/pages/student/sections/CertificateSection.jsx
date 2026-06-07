import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Award, Download, Share2, Eye, Calendar, Star } from 'lucide-react';

const CertificateSection = () => {
  const { colors } = useTheme();
  
  const certificates = [
    { id: 1, title: 'Advanced Web Development', issueDate: 'March 15, 2024', grade: 'A', score: 92, image: '💻', certificateId: 'UCC-CERT-2024-001' },
    { id: 2, title: 'Database Systems', issueDate: 'February 20, 2024', grade: 'A-', score: 88, image: '🗄️', certificateId: 'UCC-CERT-2024-002' },
    { id: 3, title: 'Data Structures', issueDate: 'January 25, 2024', grade: 'B+', score: 85, image: '📊', certificateId: 'UCC-CERT-2024-003' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Certificates</h1><p className="text-sm" style={{ color: colors.textSecondary }}>View and download your earned certificates</p></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {certificates.map((cert, idx) => (
          <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3" style={{ backgroundColor: `${colors.primary}20` }}>{cert.image}</div>
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{cert.title}</h3>
            <div className="flex justify-center gap-3 mt-2 text-sm"><div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{cert.issueDate}</span></div><div className="flex items-center gap-1"><Star size={14} style={{ color: colors.primary }} /><span style={{ color: colors.primary }}>{cert.grade}</span></div></div>
            <div className="mt-2 text-xs" style={{ color: colors.textSubtle }}>Certificate ID: {cert.certificateId}</div>
            <div className="mt-3 flex gap-2"><button className="flex-1 py-1.5 rounded text-sm flex items-center justify-center gap-1" style={{ backgroundColor: colors.primary, color: '#000' }}><Download size={14} /> PDF</button><button className="flex-1 py-1.5 rounded text-sm flex items-center justify-center gap-1" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Share2 size={14} /> Share</button></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CertificateSection;