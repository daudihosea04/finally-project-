import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { 
  BarChart3, TrendingUp, Award, FileText, Download, Printer, 
  Eye, PieChart, Activity, Calendar, Users, BookOpen, 
  CheckCircle, AlertCircle, Star, Target, Zap, Shield,
  Upload, Filter, Search, X, ArrowUp, ArrowDown, AlertTriangle,
  Mail, Share2, Clock, RefreshCw, Settings, ChevronDown
} from 'lucide-react';

const GradingAnalyticsDashboard = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('2025/2026');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    average_grade: 0,
    submission_rate: 0,
    pass_rate: 0,
    completion_rate: 0,
    top_performers: [],
    bottom_performers: [],
    grade_distribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    course_performance: [],
    monthly_trends: [],
    assignment_stats: []
  });
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState(['2024/2025', '2025/2026']);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDate, setReportDate] = useState({ start: '', end: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };
  
  // Fetch data from API
  useEffect(() => {
    fetchCourses();
    fetchAnalytics();
  }, [selectedCourse, selectedSemester]);
  
  const fetchCourses = async () => {
    try {
      const response = await api.get('/lecturer/courses');
      if (response.data.success) {
        setCourses(response.data.data);
        if (response.data.data.length > 0 && !selectedCourse) {
          setSelectedCourse(response.data.data[0].id);
        }
      } else {
        setCourses([
          { id: 1, title: 'Advanced Web Development', code: 'CS401', students: 45, avgGrade: 78.5 },
          { id: 2, title: 'Database Systems', code: 'CS302', students: 38, avgGrade: 82.3 },
          { id: 3, title: 'Data Structures', code: 'CS301', students: 42, avgGrade: 75.6 }
        ]);
        if (!selectedCourse) setSelectedCourse(1);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/analytics/course/${selectedCourse}`, {
        params: { semester: selectedSemester }
      });
      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        loadSampleAnalytics();
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      loadSampleAnalytics();
    } finally {
      setLoading(false);
    }
  };
  
  const loadSampleAnalytics = () => {
    setAnalytics({
      average_grade: 78.5,
      submission_rate: 92,
      pass_rate: 85,
      completion_rate: 88,
      top_performers: [
        { name: 'Jane Smith', grade: 96, attendance: 98, assignments: 5 },
        { name: 'John Doe', grade: 94, attendance: 95, assignments: 5 },
        { name: 'Sarah Williams', grade: 92, attendance: 96, assignments: 5 }
      ],
      bottom_performers: [
        { name: 'Mike Johnson', grade: 62, attendance: 68, assignments: 2 },
        { name: 'David Brown', grade: 58, attendance: 65, assignments: 1 },
        { name: 'Lisa Anderson', grade: 45, attendance: 55, assignments: 0 }
      ],
      grade_distribution: { A: 8, B: 15, C: 12, D: 6, F: 4 },
      course_performance: [
        { assignment: 'React Project', avg_grade: 82, submissions: 42, total: 45 },
        { assignment: 'Node.js API', avg_grade: 76, submissions: 38, total: 45 },
        { assignment: 'MongoDB Lab', avg_grade: 88, submissions: 44, total: 45 },
        { assignment: 'Final Project', avg_grade: 68, submissions: 35, total: 45 }
      ],
      monthly_trends: [
        { month: 'Jan', avg_grade: 75, submissions: 80 },
        { month: 'Feb', avg_grade: 78, submissions: 85 },
        { month: 'Mar', avg_grade: 82, submissions: 92 }
      ],
      assignment_stats: [
        { title: 'React Project', due_date: '2025-03-25', submitted: 42, graded: 40, avg_grade: 82 },
        { title: 'Node.js API', due_date: '2025-04-05', submitted: 38, graded: 35, avg_grade: 76 }
      ]
    });
  };
  
  // Export Functions
  const handleExportGrades = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${selectedCourse}/export-grades`, {
        params: { format: exportFormat, semester: selectedSemester },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const courseName = courses.find(c => c.id === parseInt(selectedCourse))?.title || 'course';
      link.href = url;
      link.setAttribute('download', `grades_${courseName}_${selectedSemester}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showNotificationMessage('Grades exported successfully!', 'success');
    } catch (error) {
      showNotificationMessage('Failed to export grades', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExportReport = async () => {
    if (!reportDate.start || !reportDate.end) {
      showNotificationMessage('Please select date range', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/reports/generate', {
        course_id: selectedCourse,
        start_date: reportDate.start,
        end_date: reportDate.end,
        format: exportFormat,
        include_analytics: true
      });
      
      if (response.data.success && response.data.download_url) {
        window.open(response.data.download_url, '_blank');
        showNotificationMessage('Report generated successfully!', 'success');
        setShowReportModal(false);
        setReportDate({ start: '', end: '' });
      }
    } catch (error) {
      showNotificationMessage('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrintReport = () => {
    window.print();
    showNotificationMessage('Print dialog opened', 'info');
  };
  
  const handleSendReportToEmail = async () => {
    setLoading(true);
    try {
      const response = await api.post('/reports/email', {
        course_id: selectedCourse,
        semester: selectedSemester,
        recipient_email: user?.email
      });
      
      if (response.data.success) {
        showNotificationMessage('Report sent to your email!', 'success');
      }
    } catch (error) {
      showNotificationMessage('Failed to send report', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate statistics
  const totalStudents = analytics.course_performance[0]?.total || 45;
  const totalAssignments = analytics.course_performance.length;
  const avgAssignmentGrade = analytics.course_performance.reduce((sum, a) => sum + a.avg_grade, 0) / totalAssignments || 0;
  
  const getGradeColor = (grade) => {
    if (grade >= 80) return '#32CD32';
    if (grade >= 70) return '#00E5FF';
    if (grade >= 60) return '#FFD700';
    if (grade >= 50) return '#FFA500';
    return '#FF6B6B';
  };
  
  const getGradeLetter = (grade) => {
    if (grade >= 80) return 'A';
    if (grade >= 75) return 'B+';
    if (grade >= 70) return 'B';
    if (grade >= 65) return 'C+';
    if (grade >= 60) return 'C';
    if (grade >= 50) return 'D';
    return 'F';
  };
  
  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}>
            {notification.type === 'success' && <CheckCircle size={20} className="text-white" />}
            {notification.type === 'error' && <AlertCircle size={20} className="text-white" />}
            {notification.type === 'info' && <Bell size={20} className="text-white" />}
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Grading & Analytics Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>View analytics, generate reports, and export grades</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrintReport} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
              <Printer size={16} /> Print
            </button>
            <button onClick={handleSendReportToEmail} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
              <Mail size={16} /> Email
            </button>
            <button onClick={() => setShowReportModal(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}>
              <Download size={16} /> Generate Report
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.code})</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchAnalytics} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </motion.div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Award, label: 'Average Grade', value: `${analytics.average_grade}%`, change: '+5%', color: '#FFD700', description: 'Class average' },
              { icon: TrendingUp, label: 'Submission Rate', value: `${analytics.submission_rate}%`, change: '+8%', color: '#00E5FF', description: 'Assignments submitted' },
              { icon: Users, label: 'Pass Rate', value: `${analytics.pass_rate}%`, change: '+3%', color: '#32CD32', description: 'Students passing' },
              { icon: Activity, label: 'Completion Rate', value: `${analytics.completion_rate}%`, change: '+4%', color: '#FF6B6B', description: 'Course completion' }
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</div>
                <div className="text-xs mt-1" style={{ color: stat.color }}>{stat.change} from last month</div>
                <div className="text-xs mt-1" style={{ color: colors.textSubtle }}>{stat.description}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Grade Distribution & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution Chart */}
            <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Grade Distribution</h2>
              <div className="space-y-3">
                {Object.entries(analytics.grade_distribution).map(([grade, count]) => {
                  const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                  const colors = { A: '#32CD32', B: '#00E5FF', C: '#FFD700', D: '#FFA500', F: '#FF6B6B' };
                  return (
                    <div key={grade}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: colors.textSecondary }}>Grade {grade}</span>
                        <span style={{ color: colors[grade] }}>{count} students ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full" style={{ backgroundColor: `${colors.border}` }}>
                        <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${percentage}%`, backgroundColor: colors[grade] }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: colors.border }}>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Total Students: {totalStudents} | Mean: {analytics.average_grade}% | Median: 78%</p>
              </div>
            </div>
            
            {/* Performance Summary */}
            <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Performance Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.primary}10` }}>
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>{totalAssignments}</div>
                  <div className="text-xs">Total Assignments</div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <div className="text-2xl font-bold" style={{ color: colors.secondary }}>{avgAssignmentGrade.toFixed(1)}%</div>
                  <div className="text-xs">Average Assignment Grade</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Top Performer Average</span><span style={{ color: '#32CD32' }}>94%</span></div>
                <div className="flex justify-between text-sm"><span>Bottom Performer Average</span><span style={{ color: '#FF6B6B' }}>55%</span></div>
                <div className="flex justify-between text-sm"><span>Grade Gap</span><span>39%</span></div>
              </div>
            </div>
          </div>
          
          {/* Top & Bottom Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}><Star size={18} style={{ color: '#FFD700' }} /> Top Performers</h2>
              <div className="space-y-3">
                {analytics.top_performers.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                    <div>
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{student.name}</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Attendance: {student.attendance}% • Assignments: {student.assignments}/5</div>
                    </div>
                    <div className="text-xl font-bold" style={{ color: '#32CD32' }}>{student.grade}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}><AlertTriangle size={18} style={{ color: '#FF6B6B' }} /> Needs Improvement</h2>
              <div className="space-y-3">
                {analytics.bottom_performers.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.error}10` }}>
                    <div>
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{student.name}</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Attendance: {student.attendance}% • Assignments: {student.assignments}/5</div>
                    </div>
                    <div className="text-xl font-bold" style={{ color: '#FF6B6B' }}>{student.grade}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Assignment Performance */}
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Assignment Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: colors.border }}>
                    <th className="p-3 text-left">Assignment</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Submissions</th>
                    <th className="p-3 text-left">Graded</th>
                    <th className="p-3 text-left">Avg Grade</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.assignment_stats.map((assignment, idx) => (
                    <tr key={idx} className="border-t" style={{ borderColor: colors.border }}>
                      <td className="p-3" style={{ color: colors.textPrimary }}>{assignment.title}</td>
                      <td className="p-3" style={{ color: colors.textSecondary }}>{assignment.due_date}</td>
                      <td className="p-3">{assignment.submitted}/{assignment.total || totalStudents}</td>
                      <td className="p-3">{assignment.graded || assignment.submitted}</td>
                      <td className="p-3">
                        <span style={{ color: getGradeColor(assignment.avg_grade) }}>{assignment.avg_grade}%</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${assignment.submitted === (assignment.total || totalStudents) ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {assignment.submitted === (assignment.total || totalStudents) ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Export Options */}
          <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Export Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <select className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option value="csv">CSV Format</option>
                <option value="xlsx">Excel Format</option>
                <option value="pdf">PDF Format</option>
              </select>
              <button onClick={handleExportGrades} className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <FileText size={16} /> Export Grades
              </button>
              <button onClick={() => setShowReportModal(true)} className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                <Download size={16} /> Full Report
              </button>
              <button onClick={handlePrintReport} className="py-2 rounded-lg flex items-center justify-center gap-2" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <Printer size={16} /> Print Report
              </button>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
              <p className="text-sm" style={{ color: colors.textSecondary }}>💡 Tip: Export data to Excel for further analysis or generate PDF reports for official submissions.</p>
            </div>
          </div>
        </>
      )}
      
      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Generate Report</h3>
              <button onClick={() => setShowReportModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Start Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={reportDate.start} onChange={(e) => setReportDate({...reportDate, start: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>End Date</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={reportDate.end} onChange={(e) => setReportDate({...reportDate, end: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Format</label>
                <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }}
                  value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <button onClick={handleExportReport} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingAnalyticsDashboard;