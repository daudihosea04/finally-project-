import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { BarChart3, TrendingUp, Award, FileText, Download, Printer, Eye, PieChart, Activity, Calendar, Users, BookOpen } from 'lucide-react';

const GradingAnalyticsDashboard = () => {
  const { colors } = useTheme();
  const [selectedCourse, setSelectedCourse] = useState('CS401');
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(78), 500);
    return () => clearTimeout(timer);
  }, []);

  const courses = ['CS401 - Web Dev', 'CS302 - Database', 'CS301 - Algorithms'];
  
  const analytics = {
    avgGrade: 78,
    submissionRate: 92,
    passRate: 85,
    completionRate: 88,
    topPerformer: { name: 'Jane Smith', grade: 96 },
    bottomPerformer: { name: 'Mike Johnson', grade: 62 }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Grading & Analytics</h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>View analytics, generate reports, and export grades</p>
        <div className="mt-4 flex gap-2"><select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>{courses.map(c => <option key={c}>{c}</option>)}</select><button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Download size={16} /> Export Report</button></div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ icon: Award, label: 'Average Grade', value: `${analytics.avgGrade}%`, color: '#FFD700' }, { icon: TrendingUp, label: 'Submission Rate', value: `${analytics.submissionRate}%`, color: '#00E5FF' }, { icon: Users, label: 'Pass Rate', value: `${analytics.passRate}%`, color: '#32CD32' }, { icon: Activity, label: 'Completion Rate', value: `${analytics.completionRate}%`, color: '#FF6B6B' }].map((stat, idx) => (<motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={24} style={{ color: stat.color }} /></div><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</div></motion.div>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Grade Distribution</h2><div className="space-y-3"><div><div className="flex justify-between text-sm mb-1"><span>A (90-100)</span><span>15%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: '15%', backgroundColor: '#32CD32' }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>B (80-89)</span><span>35%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: '35%', backgroundColor: '#00E5FF' }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>C (70-79)</span><span>30%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: '30%', backgroundColor: '#FFD700' }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>D (60-69)</span><span>12%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: '12%', backgroundColor: '#FF6B6B' }}></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>F (below 60)</span><span>8%</span></div><div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-2 rounded-full" style={{ width: '8%', backgroundColor: colors.error }}></div></div></div></div></div>

        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Top & Bottom Performers</h2><div className="space-y-3"><div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}10` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>🏆 {analytics.topPerformer.name}</div><div className="text-xs" style={{ color: colors.textSubtle }}>Top Performer</div></div><div className="text-xl font-bold" style={{ color: colors.primary }}>{analytics.topPerformer.grade}%</div></div><div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.error}10` }}><div><div className="font-medium" style={{ color: colors.textPrimary }}>⚠️ {analytics.bottomPerformer.name}</div><div className="text-xs" style={{ color: colors.textSubtle }}>Needs Improvement</div></div><div className="text-xl font-bold" style={{ color: colors.error }}>{analytics.bottomPerformer.grade}%</div></div></div></div>
      </div>

      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Export Options</h2><div className="grid grid-cols-2 gap-3"><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><FileText size={16} /> Export to CSV</button><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Download size={16} /> Export to Excel</button><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Printer size={16} /> Print Report</button><button className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><PieChart size={16} /> Sync with ARIS</button></div></div>
    </div>
  );
};

export default GradingAnalyticsDashboard;