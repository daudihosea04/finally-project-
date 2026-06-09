import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, Users, Clock, Award, Calendar } from 'lucide-react';

const Courses = () => {
  const { colors } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState('all');

  const programmes = [
    { id: 1, title: 'Computing and Information Technology (CIT)', level: 'Certificate', code: 'CIT101', duration: '1 Year', students: 45, modules: 12, intake: 'March/April, September/October' },
    { id: 2, title: 'Business Information Technology (BIT)', level: 'Certificate', code: 'BIT101', duration: '1 Year', students: 38, modules: 10, intake: 'March/April, September/October' },
    { id: 3, title: 'Computing and Information Technology (CIT)', level: 'Diploma', code: 'CIT201', duration: '2 Years', students: 52, modules: 24, intake: 'March/April, September/October' },
    { id: 4, title: 'Business Information Technology (BIT)', level: 'Diploma', code: 'BIT201', duration: '2 Years', students: 42, modules: 22, intake: 'March/April, September/October' },
  ];

  const filtered = selectedLevel === 'all' ? programmes : programmes.filter(p => p.level.toLowerCase() === selectedLevel);

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>Our <span style={{ color: colors.primary }}>Programmes</span></h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>NACTVET-accredited Certificate and Diploma programmes</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {['all', 'certificate', 'diploma'].map(level => (
            <button key={level} onClick={() => setSelectedLevel(level)} className={`px-6 py-2 rounded-lg font-semibold transition-all ${selectedLevel === level ? 'shadow-md' : ''}`} style={{ backgroundColor: selectedLevel === level ? colors.primary : 'transparent', color: selectedLevel === level ? '#000' : colors.textSecondary, border: selectedLevel === level ? 'none' : `1px solid ${colors.border}` }}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map(course => (
            <div key={course.id} className="glass-card p-6 rounded-xl" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.level}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Code: {course.code} • {course.duration}</p>
              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1"><Users size={14} style={{ color: colors.primary }} />{course.students} students</div>
                <div className="flex items-center gap-1"><BookOpen size={14} style={{ color: colors.primary }} />{course.modules} modules</div>
                <div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.primary }} />{course.intake}</div>
              </div>
              <button className="w-full py-2 rounded-lg font-semibold" style={{ backgroundColor: colors.primary, color: '#000' }}>View Details</button>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card p-8 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>Academic Progression Pathway</h2>
          <p className="mb-4" style={{ color: colors.textSecondary }}>Certificate → Diploma → Bachelor's Degree at University of Dar es Salaam</p>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <div className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20` }}>Certificate</div>
            <span style={{ color: colors.primary }}>→</span>
            <div className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20` }}>Diploma Year 1</div>
            <span style={{ color: colors.primary }}>→</span>
            <div className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20` }}>Diploma Year 2</div>
            <span style={{ color: colors.primary }}>→</span>
            <div className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20` }}>Bachelor's at UDSM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;