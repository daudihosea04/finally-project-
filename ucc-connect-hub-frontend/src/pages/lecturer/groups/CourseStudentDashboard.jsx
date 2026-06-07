import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { 
  BookOpen, Users, CheckCircle, Award, Plus, Search, Download, Eye, Edit, 
  TrendingUp, Calendar, Clock, UserPlus, BarChart3, X, AlertCircle, Check,
  Settings, Trash2, MessageCircle, FileText
} from 'lucide-react';

const CourseStudentDashboard = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);
  const [showNotification, setShowNotification] = useState({ show: false, message: '', type: '' });
  
  const [stats, setStats] = useState({ courses: 0, students: 0, present: 0, attendance: 0 });
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', title: '', description: '', credits: 3, schedule: '', room: '' });
  const [enrollmentData, setEnrollmentData] = useState({ studentEmail: '', studentName: '', courseId: '' });

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        api.get('/courses/lecturer/' + user?.id),
        api.get('/users/role/student')
      ]);
      const coursesData = coursesRes.data.data || coursesRes.data || [];
      const studentsData = studentsRes.data.data || studentsRes.data || [];
      setCourses(coursesData);
      setStudents(studentsData);
      setStats({
        courses: coursesData.length,
        students: studentsData.length,
        present: Math.floor(studentsData.length * 0.85),
        attendance: 85
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('Failed to load data', 'error');
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleCourses = [
      { id: 1, code: 'CS401', title: 'Advanced Web Development', students: 45, schedule: 'Mon & Wed, 2:00 PM', progress: 75, status: 'Active', description: 'Learn modern web development with React and Node.js', credits: 3, room: 'Lab 301' },
      { id: 2, code: 'CS302', title: 'Database Systems', students: 38, schedule: 'Tue & Thu, 10:00 AM', progress: 68, status: 'Active', description: 'Master SQL and database design', credits: 3, room: 'Lab 205' },
      { id: 3, code: 'CS301', title: 'Data Structures', students: 42, schedule: 'Mon & Fri, 11:00 AM', progress: 82, status: 'Active', description: 'Learn algorithms and data structures', credits: 3, room: 'Lecture Hall B' },
    ];
    const sampleStudents = [
      { id: 1, name: 'John Doe', regNo: 'UCC/2024/001', email: 'john@ucc.ac.tz', attendance: 92, status: 'Active', course: 'CS401', courseId: 1 },
      { id: 2, name: 'Jane Smith', regNo: 'UCC/2024/002', email: 'jane@ucc.ac.tz', attendance: 88, status: 'Active', course: 'CS401', courseId: 1 },
      { id: 3, name: 'Mike Johnson', regNo: 'UCC/2024/003', email: 'mike@ucc.ac.tz', attendance: 76, status: 'At Risk', course: 'CS302', courseId: 2 },
      { id: 4, name: 'Sarah Williams', regNo: 'UCC/2024/004', email: 'sarah@ucc.ac.tz', attendance: 95, status: 'Active', course: 'CS301', courseId: 3 },
      { id: 5, name: 'David Brown', regNo: 'UCC/2024/005', email: 'david@ucc.ac.tz', attendance: 68, status: 'At Risk', course: 'CS302', courseId: 2 },
    ];
    setCourses(sampleCourses);
    setStudents(sampleStudents);
    setStats({ courses: sampleCourses.length, students: sampleStudents.length, present: 38, attendance: 85 });
  };

  const showMessage = (message, type = 'success') => {
    setShowNotification({ show: true, message, type });
    setTimeout(() => setShowNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetailsModal(true);
  };

  const handleViewStudents = (course) => {
    const courseStudents = students.filter(s => s.course === course.code || s.courseId === course.id);
    setSelectedCourse(course);
    setSelectedCourseStudents(courseStudents);
    setShowStudentsModal(true);
  };

  const handleEditCourse = async (course) => {
    showMessage('Edit course feature coming soon', 'info');
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.delete(`/courses/${courseId}`);
        showMessage('Course deleted successfully!');
        fetchData();
      } catch (error) {
        showMessage('Failed to delete course', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveStudent = async (studentId, courseId) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      showMessage('Student removed from course', 'success');
      setSelectedCourseStudents(prev => prev.filter(s => s.id !== studentId));
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, courseId: null, course: null } : s));
    }
  };

  const handleEnrollStudent = async () => {
    if (!enrollmentData.studentEmail) {
      showMessage('Please enter student email', 'error');
      return;
    }
    
    if (!enrollmentData.courseId) {
      showMessage('Please select a course', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const selectedCourseObj = courses.find(c => c.id === parseInt(enrollmentData.courseId));
      
      if (!selectedCourseObj) {
        showMessage('Selected course not found', 'error');
        setLoading(false);
        return;
      }
      
      let existingStudent = students.find(s => s.email === enrollmentData.studentEmail);
      
      if (existingStudent) {
        const updatedStudent = {
          ...existingStudent,
          course: selectedCourseObj.code,
          courseId: selectedCourseObj.id
        };
        setStudents(prev => prev.map(s => s.id === existingStudent.id ? updatedStudent : s));
        showMessage(`${existingStudent.name} has been enrolled in ${selectedCourseObj.title}!`, 'success');
      } else {
        const newStudentId = students.length + 1;
        const newStudent = {
          id: newStudentId,
          name: enrollmentData.studentName || enrollmentData.studentEmail.split('@')[0],
          email: enrollmentData.studentEmail,
          regNo: `UCC/2024/${String(newStudentId).padStart(3, '0')}`,
          attendance: 0,
          status: 'Active',
          course: selectedCourseObj.code,
          courseId: selectedCourseObj.id
        };
        setStudents(prev => [...prev, newStudent]);
        showMessage(`New student ${newStudent.name} has been enrolled in ${selectedCourseObj.title}!`, 'success');
      }
      
      setCourses(prev => prev.map(c => 
        c.id === selectedCourseObj.id 
          ? { ...c, students: (c.students || 0) + 1 }
          : c
      ));
      
      setShowEnrollModal(false);
      setEnrollmentData({ studentEmail: '', studentName: '', courseId: '' });
      
      setStats(prev => ({
        ...prev,
        students: prev.students + 1,
        present: prev.present + 1
      }));
      
    } catch (error) {
      console.error('Enrollment error:', error);
      showMessage('Failed to enroll student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.title) {
      showMessage('Please fill in course code and title', 'error');
      return;
    }
    setLoading(true);
    try {
      const newCourseObj = {
        id: courses.length + 1,
        code: newCourse.code,
        title: newCourse.title,
        description: newCourse.description,
        credits: newCourse.credits,
        schedule: newCourse.schedule,
        room: newCourse.room,
        students: 0,
        progress: 0,
        status: 'Active'
      };
      
      setCourses(prev => [...prev, newCourseObj]);
      showMessage('Course created successfully!');
      setShowAddCourseModal(false);
      setNewCourse({ code: '', title: '', description: '', credits: 3, schedule: '', room: '' });
      setStats(prev => ({ ...prev, courses: prev.courses + 1 }));
      
    } catch (error) {
      showMessage('Failed to create course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: BookOpen, title: 'Total Courses', value: stats.courses, change: '+1', color: '#FFD700' },
    { icon: Users, title: 'Total Students', value: stats.students, change: '+12', color: '#00E5FF' },
    { icon: CheckCircle, title: 'Present Today', value: stats.present, change: '+5%', color: '#32CD32' },
    { icon: Award, title: 'Avg Attendance', value: `${stats.attendance}%`, change: '+3%', color: '#FF6B6B' },
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

      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, border: `1px solid ${colors.border}` }}>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Course & Student Management</h1>
          <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Manage your courses, track student progress, and monitor attendance</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAddCourseModal(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}>
              <Plus size={16} /> Add Course
            </button>
            <button onClick={() => setShowEnrollModal(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:scale-105" style={{ border: `1px solid ${colors.primary}`, color: colors.primary }}>
              <UserPlus size={16} /> Enroll Student
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full" style={{ backgroundColor: `${colors.primary}10`, filter: 'blur(60px)' }}></div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}><stat.icon size={20} style={{ color: stat.color }} /></div><span className="text-xs" style={{ color: stat.color }}>{stat.change}</span></div>
            <div className="mt-2"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{stat.value}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{stat.title}</div></div>
          </motion.div>
        ))}
      </div>

      {/* Courses */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>My Courses</h2><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}`, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((course, idx) => (
            <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={{ color: colors.textPrimary }}>{course.title}</h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.schedule || 'TBD'}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.status || 'Active'}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1"><span style={{ color: colors.textSubtle }}>Progress</span><span style={{ color: colors.primary }}>{course.progress || 0}%</span></div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${course.progress || 0}%`, backgroundColor: colors.primary }}></div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleManageCourse(course)} className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Settings size={14} className="inline mr-1" /> Manage</button>
                <button onClick={() => handleViewStudents(course)} className="flex-1 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Users size={14} className="inline mr-1" /> View Students</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="flex justify-between mb-4"><h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Enrolled Students</h2><button className="text-sm flex items-center gap-1" style={{ color: colors.primary }}><Download size={14} /> Export</button></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Student</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Reg No.</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Email</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Attendance</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Status</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td className="py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>👨‍🎓</div><span style={{ color: colors.textPrimary }}>{student.name}</span></div></td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{student.regNo || student.id}</td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{student.email}</td>
                  <td className="py-3"><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-1.5 rounded-full" style={{ width: `${student.attendance || 85}%`, backgroundColor: (student.attendance || 85) > 85 ? '#32CD32' : (student.attendance || 85) > 70 ? '#FFD700' : '#FF6B6B' }}></div></div><span className="text-sm" style={{ color: colors.textSecondary }}>{student.attendance || 85}%</span></div></td>
                  <td className="py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: student.status === 'Active' ? `${colors.primary}20` : `${colors.error}20`, color: student.status === 'Active' ? colors.primary : colors.error }}>{student.status || 'Active'}</span></td>
                  <td className="py-3"><div className="flex gap-2"><Eye size={16} className="cursor-pointer hover:scale-110 transition" style={{ color: colors.primary }} /><Edit size={16} className="cursor-pointer hover:scale-110 transition" style={{ color: colors.secondary }} /><MessageCircle size={16} className="cursor-pointer hover:scale-110 transition" style={{ color: colors.primary }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* COURSE DETAILS MODAL */}
      {showCourseDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCourseDetailsModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Details</h3><button onClick={() => setShowCourseDetailsModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-lg font-bold" style={{ color: colors.textPrimary }}>{selectedCourse.title}</p><p className="text-sm" style={{ color: colors.textSecondary }}>{selectedCourse.code}</p></div>
              <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Description</label><p style={{ color: colors.textPrimary }}>{selectedCourse.description || 'No description provided'}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Credits</label><p style={{ color: colors.textPrimary }}>{selectedCourse.credits || 3}</p></div>
                <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Room</label><p style={{ color: colors.textPrimary }}>{selectedCourse.room || 'TBD'}</p></div>
                <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Schedule</label><p style={{ color: colors.textPrimary }}>{selectedCourse.schedule || 'TBD'}</p></div>
                <div><label className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Students</label><p style={{ color: colors.textPrimary }}>{selectedCourse.students || 0}</p></div>
              </div>
              <div className="flex gap-2 pt-3">
                <button onClick={() => { setShowCourseDetailsModal(false); handleEditCourse(selectedCourse); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Edit size={14} className="inline mr-1" /> Edit Course</button>
                <button onClick={() => { setShowCourseDetailsModal(false); handleDeleteCourse(selectedCourse.id); }} className="flex-1 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.error}20`, color: colors.error }}><Trash2 size={14} className="inline mr-1" /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS IN COURSE MODAL */}
      {showStudentsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowStudentsModal(false)}>
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Students in: {selectedCourse.title}</h3><button onClick={() => setShowStudentsModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            {selectedCourseStudents.length === 0 ? (
              <div className="text-center py-8" style={{ color: colors.textSecondary }}>No students enrolled in this course yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                    <th className="text-left py-3" style={{ color: colors.textSecondary }}>Student</th>
                    <th className="text-left py-3" style={{ color: colors.textSecondary }}>Email</th>
                    <th className="text-left py-3" style={{ color: colors.textSecondary }}>Attendance</th>
                    <th className="text-left py-3" style={{ color: colors.textSecondary }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourseStudents.map((student, idx) => (
                    <tr key={student.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="py-3" style={{ color: colors.textPrimary }}>{student.name}</td>
                      <td className="py-3" style={{ color: colors.textSecondary }}>{student.email}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${(student.attendance || 85) > 85 ? 'bg-green-500/20 text-green-500' : (student.attendance || 85) > 70 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>{student.attendance || 85}%</span></td>
                      <td className="py-3"><button onClick={() => handleRemoveStudent(student.id, selectedCourse.id)} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${colors.error}20`, color: colors.error }}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 pt-3 border-t flex justify-end" style={{ borderColor: colors.border }}><button onClick={() => setShowStudentsModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Close</button></div>
          </div>
        </div>
      )}

      {/* ADD COURSE MODAL */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddCourseModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Add New Course</h3><button onClick={() => setShowAddCourseModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button></div>
            <div className="space-y-3">
              <input type="text" placeholder="Course Code (e.g., CS401)" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} />
              <input type="text" placeholder="Course Title" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3"><input type="number" placeholder="Credits" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})} /><input type="text" placeholder="Schedule" className="input-field" style={{ border: `1px solid ${colors.border}` }} value={newCourse.schedule} onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})} /></div>
              <input type="text" placeholder="Room" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={newCourse.room} onChange={(e) => setNewCourse({...newCourse, room: e.target.value})} />
              <button onClick={handleAddCourse} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Creating...' : 'Create Course'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEnrollModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Enroll Student</h3>
              <button onClick={() => setShowEnrollModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Student Name</label><input type="text" placeholder="e.g., Warioba Collins" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={enrollmentData.studentName} onChange={(e) => setEnrollmentData({...enrollmentData, studentName: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Student Email *</label><input type="email" placeholder="e.g., wariobacollins@gmail.com" className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={enrollmentData.studentEmail} onChange={(e) => setEnrollmentData({...enrollmentData, studentEmail: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Select Course *</label>
                <select className="input-field w-full" style={{ border: `1px solid ${colors.border}` }} value={enrollmentData.courseId} onChange={(e) => setEnrollmentData({...enrollmentData, courseId: e.target.value})}>
                  <option value="">-- Select a Course --</option>
                  {courses.map(c => (<option key={c.id} value={c.id}>{c.code} - {c.title}</option>))}
                </select>
                {courses.length === 0 && (<p className="text-xs mt-1" style={{ color: colors.error }}>No courses available. Please add a course first.</p>)}
              </div>
              <button onClick={handleEnrollStudent} className="w-full py-2 rounded-lg transition-all hover:scale-105 mt-2" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading || courses.length === 0}>{loading ? 'Enrolling...' : 'Enroll Student'}</button>
              <div className="p-3 rounded-lg mt-2" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-xs" style={{ color: colors.textSecondary }}>💡 <strong>Note:</strong> If the student doesn't exist, they will be automatically created.</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStudentDashboard;