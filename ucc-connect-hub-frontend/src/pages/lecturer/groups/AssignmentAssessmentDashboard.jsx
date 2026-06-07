import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { 
  ClipboardList, CheckCircle, Clock, Award, Plus, Search, Eye, Edit, 
  FileText, Upload, TrendingUp, Calendar, Star, X, AlertCircle, Check,
  Download, Trash2, Send, Save, RotateCcw
} from 'lucide-react';

const AssignmentAssessmentDashboard = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignmentSubmissions, setSelectedAssignmentSubmissions] = useState([]);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState('');
  const [showNotification, setShowNotification] = useState({ show: false, message: '', type: '' });
  
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    due_time: '',
    total_points: 100
  });
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, submissionsRes, coursesRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/submissions'),
        api.get('/courses/lecturer/' + user?.id)
      ]);
      setAssignments(assignmentsRes.data.data || assignmentsRes.data || []);
      setSubmissions(submissionsRes.data.data || submissionsRes.data || []);
      setCourses(coursesRes.data.data || coursesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('Failed to load data', 'error');
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setAssignments([
      { id: 1, title: 'React.js Final Project', course: 'Advanced Web Development', course_id: 1, dueDate: '2024-03-25', submitted: 32, total: 45, avgGrade: 78, status: 'Active', description: 'Build a full-stack application using React and Node.js', total_points: 100 },
      { id: 2, title: 'Database Normalization', course: 'Database Systems', course_id: 2, dueDate: '2024-03-20', submitted: 38, total: 38, avgGrade: 82, status: 'Grading', description: 'Normalize the given database to 3NF', total_points: 100 },
      { id: 3, title: 'Sorting Algorithms', course: 'Data Structures', course_id: 3, dueDate: '2024-03-22', submitted: 30, total: 42, avgGrade: 75, status: 'Active', description: 'Implement and compare sorting algorithms', total_points: 100 },
    ]);
    setSubmissions([
      { id: 1, student: 'John Doe', assignment: 'React.js Final Project', assignmentId: 1, submittedDate: '2024-03-18', status: 'pending', grade: null, file: { name: 'john_doe_project.zip', url: '/sample/project.zip' } },
      { id: 2, student: 'Jane Smith', assignment: 'React.js Final Project', assignmentId: 1, submittedDate: '2024-03-19', status: 'pending', grade: null, file: { name: 'jane_smith_app.zip', url: '/sample/app.zip' } },
      { id: 3, student: 'Mike Johnson', assignment: 'Database Normalization', assignmentId: 2, submittedDate: '2024-03-17', status: 'graded', grade: 85, file: { name: 'normalization.pdf', url: '/sample/normalization.pdf' } },
    ]);
    setCourses([
      { id: 1, title: 'Advanced Web Development', code: 'CS401' },
      { id: 2, title: 'Database Systems', code: 'CS302' },
      { id: 3, title: 'Data Structures', code: 'CS301' },
    ]);
  };

  const showMessage = (message, type = 'success') => {
    setShowNotification({ show: true, message, type });
    setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleDownloadSubmission = async (submission) => {
    try {
      if (submission.file?.url) {
        const link = document.createElement('a');
        link.href = submission.file.url;
        link.setAttribute('download', submission.file.name || 'submission_file');
        document.body.appendChild(link);
        link.click();
        link.remove();
        showMessage('Download started!', 'success');
      } else {
        showMessage('Demo: File would download here', 'info');
      }
    } catch (error) {
      console.error('Download error:', error);
      showMessage('Failed to download file', 'error');
    }
  };

  // VIEW SUBMISSIONS FUNCTION - FIXED
  const handleViewSubmissions = async (assignment) => {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await api.get(`/submissions/assignment/${assignment.id}`);
      const submissionsData = response.data.data || response.data || [];
      setSelectedAssignmentSubmissions(submissionsData);
      setSelectedAssignmentTitle(assignment.title);
      setShowSubmissionsModal(true);
    } catch (error) {
      // Use sample data for demo
      const sampleSubmissionsForAssignment = submissions.filter(s => 
        s.assignment === assignment.title || s.assignmentId === assignment.id
      );
      setSelectedAssignmentSubmissions(sampleSubmissionsForAssignment.length > 0 ? sampleSubmissionsForAssignment : [
        { id: 1, student: 'John Doe', submittedDate: '2024-03-18', status: 'submitted', grade: null, file: 'project.zip' },
        { id: 2, student: 'Jane Smith', submittedDate: '2024-03-19', status: 'submitted', grade: null, file: 'app.zip' },
        { id: 3, student: 'Mike Johnson', submittedDate: '2024-03-17', status: 'graded', grade: 85, file: 'work.pdf' },
      ]);
      setSelectedAssignmentTitle(assignment.title);
      setShowSubmissionsModal(true);
    } finally {
      setLoading(false);
    }
  };

  // EDIT ASSIGNMENT FUNCTION
  const handleEditAssignment = (assignment) => {
    setEditingAssignment({
      ...assignment,
      due_date: assignment.dueDate || assignment.due_date,
    });
    setShowEditModal(true);
  };

  // UPDATE ASSIGNMENT FUNCTION
  const handleUpdateAssignment = async () => {
    if (!editingAssignment.title || !editingAssignment.course_id || !editingAssignment.due_date) {
      showMessage('Please fill in required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/assignments/${editingAssignment.id}`, {
        title: editingAssignment.title,
        description: editingAssignment.description,
        course_id: editingAssignment.course_id,
        due_date: editingAssignment.due_date,
        due_time: editingAssignment.due_time,
        total_points: editingAssignment.total_points,
        status: editingAssignment.status
      });
      showMessage('Assignment updated successfully!');
      setShowEditModal(false);
      setEditingAssignment(null);
      fetchData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // DELETE ASSIGNMENT FUNCTION
  const handleDeleteAssignment = async (assignmentId) => {
    setLoading(true);
    try {
      await api.delete(`/assignments/${assignmentId}`);
      showMessage('Assignment deleted successfully!');
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      showMessage('Failed to delete assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradeData.grade) {
      showMessage('Please enter a grade', 'error');
      return;
    }
    if (gradeData.grade < 0 || gradeData.grade > 100) {
      showMessage('Grade must be between 0 and 100', 'error');
      return;
    }
    setLoading(true);
    try {
      if (selectedSubmission?.id) {
        await api.put(`/submissions/${selectedSubmission.id}`, {
          grade: parseInt(gradeData.grade),
          feedback: gradeData.feedback
        });
      }
      showMessage('Submission graded successfully!');
      setSelectedSubmission(null);
      setGradeData({ grade: '', feedback: '' });
      fetchData();
      setShowSubmissionsModal(false);
    } catch (error) {
      showMessage('Failed to grade submission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.course_id || !newAssignment.due_date) {
      showMessage('Please fill in required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.post('/assignments', {
        ...newAssignment,
        created_by: user?.id
      });
      showMessage('Assignment created successfully!');
      setShowCreateModal(false);
      setNewAssignment({ title: '', description: '', course_id: '', due_date: '', due_time: '', total_points: 100 });
      fetchData();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to create assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: ClipboardList, label: 'Total Assignments', value: assignments.length, change: '+2', color: '#FFD700' },
    { icon: CheckCircle, label: 'Completed', value: assignments.filter(a => a.status === 'Completed').length, change: '+1', color: '#32CD32' },
    { icon: Clock, label: 'Pending Grading', value: submissions.filter(s => s.status === 'pending').length, change: '+3', color: '#FF6B6B' },
    { icon: Award, label: 'Avg Grade', value: '78%', change: '+5%', color: '#00E5FF' },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {showNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${showNotification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {showNotification.type === 'success' ? <Check size={20} className="text-white" /> : <AlertCircle size={20} className="text-white" />}
            <span className="text-white">{showNotification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Assignment & Assessment</h1>
        <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Create, manage, and grade assignments</p>
        <button onClick={() => setShowCreateModal(true)} className="mt-4 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}>
          <Plus size={16} /> Create Assignment
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={20} style={{ color: stat.color }} /></div><span className="text-xs" style={{ color: stat.color }}>{stat.change}</span></div>
            <div className="mt-2"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</div></div>
          </motion.div>
        ))}
      </div>

      {/* Assignments List */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>All Assignments</h2>
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search assignments..." className="pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="space-y-3">
          {assignments.filter(a => a.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((assignment, idx) => (
            <motion.div key={assignment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div><h3 className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{assignment.course} • Due: {assignment.dueDate}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full ${assignment.status === 'Active' ? 'bg-green-500/20 text-green-500' : assignment.status === 'Grading' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`} style={{ color: assignment.status === 'Active' ? '#32CD32' : assignment.status === 'Grading' ? '#FFD700' : '#00E5FF' }}>{assignment.status || 'Active'}</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
                <div><div className="font-semibold" style={{ color: colors.primary }}>{assignment.submitted || 0}</div><div className="text-xs">Submitted</div></div>
                <div><div className="font-semibold" style={{ color: colors.secondary }}>{(assignment.total || 0) - (assignment.submitted || 0)}</div><div className="text-xs">Pending</div></div>
                <div><div className="font-semibold" style={{ color: '#32CD32' }}>{assignment.avgGrade || 0}%</div><div className="text-xs">Avg Grade</div></div>
                <div><div className="font-semibold" style={{ color: colors.textPrimary }}>{assignment.total || 0}</div><div className="text-xs">Total</div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => handleViewSubmissions(assignment)} 
                  className="flex-1 py-1.5 rounded text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                >
                  <Eye size={14} className="inline mr-1" /> Submissions
                </button>
                <button 
                  onClick={() => setSelectedSubmission({ assignment: assignment.title, id: null })} 
                  className="flex-1 py-1.5 rounded text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}
                >
                  <Star size={14} className="inline mr-1" /> Grade
                </button>
                <button 
                  onClick={() => handleEditAssignment(assignment)} 
                  className="flex-1 py-1.5 rounded text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                >
                  <Edit size={14} className="inline mr-1" /> Edit
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(assignment.id)} 
                  className="flex-1 py-1.5 rounded text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: `${colors.error}20`, color: colors.error }}
                >
                  <Trash2 size={14} className="inline mr-1" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending Submissions */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Pending Submissions</h2>
        <div className="space-y-2">
          {submissions.filter(s => s.status === 'pending').map((sub, idx) => (
            <div key={sub.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
              <div>
                <div className="font-medium" style={{ color: colors.textPrimary }}>{sub.student}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>{sub.assignment} • {sub.submittedDate}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownloadSubmission(sub)} 
                  className="px-2 py-1 rounded text-xs transition-all hover:scale-105 flex items-center gap-1"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                >
                  <Download size={12} /> Download
                </button>
                <button 
                  onClick={() => setSelectedSubmission(sub)} 
                  className="px-3 py-1 rounded text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: colors.primary, color: '#000' }}
                >
                  Grade Now
                </button>
              </div>
            </div>
          ))}
          {submissions.filter(s => s.status === 'pending').length === 0 && (
            <div className="text-center py-8" style={{ color: colors.textSecondary }}>
              <CheckCircle size={40} style={{ color: colors.primary }} className="mx-auto mb-2" />
              No pending submissions! 🎉
            </div>
          )}
        </div>
      </div>

      {/* VIEW SUBMISSIONS MODAL - FIXED */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSubmissionsModal(false)}>
          <div className="glass-card p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                Submissions for: {selectedAssignmentTitle}
              </h3>
              <button onClick={() => setShowSubmissionsModal(false)}>
                <X size={20} style={{ color: colors.textSecondary }} />
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedAssignmentSubmissions.length === 0 ? (
                <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                  No submissions yet for this assignment.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                      <th className="text-left py-3" style={{ color: colors.textSecondary }}>Student</th>
                      <th className="text-left py-3" style={{ color: colors.textSecondary }}>Submitted Date</th>
                      <th className="text-left py-3" style={{ color: colors.textSecondary }}>Status</th>
                      <th className="text-left py-3" style={{ color: colors.textSecondary }}>Grade</th>
                      <th className="text-left py-3" style={{ color: colors.textSecondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAssignmentSubmissions.map((sub, idx) => (
                      <tr key={sub.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td className="py-3" style={{ color: colors.textPrimary }}>{sub.student}</td>
                        <td className="py-3" style={{ color: colors.textSecondary }}>{sub.submittedDate}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'graded' || sub.grade ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {sub.status === 'graded' || sub.grade ? 'Graded' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3" style={{ color: sub.grade ? '#32CD32' : colors.textSecondary }}>
                          {sub.grade ? `${sub.grade}%` : '—'}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            {sub.file && (
                              <button 
                                onClick={() => handleDownloadSubmission(sub)} 
                                className="px-2 py-1 rounded text-xs flex items-center gap-1"
                                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                              >
                                <Download size={12} /> File
                              </button>
                            )}
                            {(!sub.grade && sub.status !== 'graded') && (
                              <button 
                                onClick={() => {
                                  setShowSubmissionsModal(false);
                                  setSelectedSubmission(sub);
                                }}
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: colors.primary, color: '#000' }}
                              >
                                Grade
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: colors.border }}>
              <button 
                onClick={() => setShowSubmissionsModal(false)} 
                className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Assignment</h3><button onClick={() => setShowCreateModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <input type="text" placeholder="Assignment Title *" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
              <select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.course_id} onChange={(e) => setNewAssignment({...newAssignment, course_id: e.target.value})}>
                <option value="">Select Course *</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3"><input type="date" placeholder="Due Date" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.due_date} onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})} /><input type="time" placeholder="Due Time" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.due_time} onChange={(e) => setNewAssignment({...newAssignment, due_time: e.target.value})} /></div>
              <input type="number" placeholder="Total Points" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newAssignment.total_points} onChange={(e) => setNewAssignment({...newAssignment, total_points: parseInt(e.target.value)})} />
              <button onClick={handleCreateAssignment} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Creating...' : 'Create Assignment'}</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ASSIGNMENT MODAL */}
      {showEditModal && editingAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Edit Assignment</h3><button onClick={() => setShowEditModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <input type="text" placeholder="Assignment Title *" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.title} onChange={(e) => setEditingAssignment({...editingAssignment, title: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.description} onChange={(e) => setEditingAssignment({...editingAssignment, description: e.target.value})} />
              <select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.course_id} onChange={(e) => setEditingAssignment({...editingAssignment, course_id: e.target.value})}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3"><input type="date" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.due_date} onChange={(e) => setEditingAssignment({...editingAssignment, due_date: e.target.value})} /><input type="time" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.due_time} onChange={(e) => setEditingAssignment({...editingAssignment, due_time: e.target.value})} /></div>
              <input type="number" placeholder="Total Points" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.total_points} onChange={(e) => setEditingAssignment({...editingAssignment, total_points: parseInt(e.target.value)})} />
              <select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={editingAssignment.status} onChange={(e) => setEditingAssignment({...editingAssignment, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Grading">Grading</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
              <div className="flex gap-2"><button onClick={handleUpdateAssignment} className="flex-1 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button><button onClick={() => setShowEditModal(false)} className="flex-1 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: `${colors.border}`, color: colors.textSecondary }}>Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="glass-card p-6 max-w-sm w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4"><AlertCircle size={48} style={{ color: colors.error }} className="mx-auto mb-3" /><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Delete Assignment?</h3><p className="text-sm mt-2" style={{ color: colors.textSecondary }}>This action cannot be undone. All submissions will also be deleted.</p></div>
            <div className="flex gap-3"><button onClick={() => handleDeleteAssignment(showDeleteConfirm)} className="flex-1 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.error, color: '#fff' }}>Delete</button><button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: `${colors.border}`, color: colors.textSecondary }}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSubmission(null)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Grade Submission</h3><button onClick={() => setSelectedSubmission(null)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3"><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-sm" style={{ color: colors.textPrimary }}>Assignment: <span style={{ color: colors.primary }}>{selectedSubmission.assignment}</span></p><p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Student: {selectedSubmission.student || 'Select student'}</p></div><input type="number" placeholder="Grade (0-100)" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} /><textarea placeholder="Feedback (optional)" rows={3} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={gradeData.feedback} onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} /><button onClick={handleGradeSubmission} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Grading...' : 'Submit Grade'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentAssessmentDashboard;