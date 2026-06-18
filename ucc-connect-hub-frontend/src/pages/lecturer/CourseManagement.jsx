import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  ArrowLeft, Users, FileText, Clock, Calendar, 
  Edit, Trash2, Plus, Upload, Download, Eye,
  CheckCircle, XCircle, AlertCircle, BarChart3,
  MessageCircle, Bell, Settings, MoreVertical,
  ChevronRight, Search, Filter, Star, Award,
  Send, Save, X, UserPlus, Video, Link2, QrCode,
  FolderOpen, BookOpen, Activity, TrendingUp,
  ClipboardList, Target, Zap, Shield, RefreshCw
} from 'lucide-react';

const CourseManagement = () => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showEnrollStudent, setShowEnrollStudent] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', due_time: '', total_points: 100 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'medium' });
  const [newMaterial, setNewMaterial] = useState({ title: '', file: null });
  const [enrollmentData, setEnrollmentData] = useState({ email: '', name: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotificationMessage = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Fetch course data from API
  useEffect(() => {
    if (id) {
      fetchCourseData();
      fetchStudents();
      fetchAssignments();
      fetchAnnouncements();
      fetchMaterials();
    }
  }, [id]);

  // FIXED: Removed /api/ prefix - api.js already has baseURL with /api
  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${id}`);
      if (response.data.success) {
        setCourse(response.data.data);
      } else {
        loadSampleCourseData();
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      loadSampleCourseData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCourseData = () => {
    setCourse({
      id: parseInt(id),
      title: 'Advanced Web Development',
      code: 'CS401',
      description: 'This course covers modern web development technologies including React, Node.js, Express, and MongoDB.',
      credits: 4,
      department: 'Computer Science',
      instructor: user?.name || 'Dr. Sarah Johnson',
      schedule: 'Monday & Wednesday, 2:00 PM - 4:00 PM',
      room: 'Lab 301',
      semester: 'Semester 1, 2025/2026',
      status: 'Active',
      enrolledStudents: students.length || 45,
      assignmentsCount: assignments.length || 4,
      avgGrade: 78.5,
      image: '💻'
    });
  };

  // FIXED: Removed /api/ prefix
  const fetchStudents = async () => {
    try {
      const response = await api.get(`/courses/${id}/students`);
      if (response.data.success && response.data.data) {
        setStudents(response.data.data);
      } else {
        setStudents(getSampleStudents());
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents(getSampleStudents());
    }
  };

  const getSampleStudents = () => [
    { id: 1, name: 'John Doe', email: 'john@ucc.ac.tz', regNo: 'UCC/DIT/2024/001', grade: 'A-', attendance: 92, status: 'Active', assignments_completed: 4, total_assignments: 4 },
    { id: 2, name: 'Jane Smith', email: 'jane@ucc.ac.tz', regNo: 'UCC/DIT/2024/002', grade: 'B+', attendance: 88, status: 'Active', assignments_completed: 3, total_assignments: 4 },
    { id: 3, name: 'Mike Johnson', email: 'mike@ucc.ac.tz', regNo: 'UCC/DIT/2024/003', grade: 'C+', attendance: 76, status: 'At Risk', assignments_completed: 2, total_assignments: 4 },
    { id: 4, name: 'Sarah Williams', email: 'sarah@ucc.ac.tz', regNo: 'UCC/DIT/2024/004', grade: 'A', attendance: 95, status: 'Active', assignments_completed: 4, total_assignments: 4 },
    { id: 5, name: 'David Brown', email: 'david@ucc.ac.tz', regNo: 'UCC/DIT/2024/005', grade: 'D+', attendance: 68, status: 'At Risk', assignments_completed: 1, total_assignments: 4 },
  ];

  // FIXED: Removed /api/ prefix
  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/courses/${id}/assignments`);
      if (response.data.success && response.data.data) {
        setAssignments(response.data.data);
      } else {
        setAssignments(getSampleAssignments());
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setAssignments(getSampleAssignments());
    }
  };

  const getSampleAssignments = () => [
    { id: 1, title: 'React.js Project', dueDate: '2025-03-25', due_date: '2025-03-25', submissions: 32, total: 45, status: 'Active', description: 'Build a full-stack application using React and Node.js', points: 100 },
    { id: 2, title: 'Node.js API Development', dueDate: '2025-04-05', due_date: '2025-04-05', submissions: 28, total: 45, status: 'Active', description: 'Create RESTful API with Express', points: 100 },
  ];

  // FIXED: Removed /api/ prefix
  const fetchAnnouncements = async () => {
    try {
      const response = await api.get(`/announcements?course_id=${id}`);
      if (response.data.success && response.data.data) {
        setAnnouncements(response.data.data);
      } else {
        setAnnouncements(getSampleAnnouncements());
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements(getSampleAnnouncements());
    }
  };

  const getSampleAnnouncements = () => [
    { id: 1, title: 'Welcome to the Course!', content: 'Please review the course syllabus and schedule.', date: '2025-01-15', priority: 'high', author: user?.name || 'Dr. Sarah Johnson' },
    { id: 2, title: 'Assignment 1 Deadline', content: 'The deadline for Assignment 1 is March 25th.', date: '2025-03-10', priority: 'medium', author: user?.name || 'Dr. Sarah Johnson' },
  ];

  // FIXED: Removed /api/ prefix
  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/courses/${id}/materials`);
      if (response.data.success && response.data.data) {
        setMaterials(response.data.data);
      } else {
        setMaterials(getSampleMaterials());
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials(getSampleMaterials());
    }
  };

  const getSampleMaterials = () => [
    { id: 1, title: 'Course Syllabus', type: 'pdf', size: '2.5 MB', uploaded_at: '2025-01-15' },
    { id: 2, title: 'Lecture 1 - Introduction', type: 'video', size: '45 MB', uploaded_at: '2025-01-20' },
    { id: 3, title: 'Week 1 Notes', type: 'pdf', size: '1.2 MB', uploaded_at: '2025-01-22' },
  ];

  // Assignment Functions
  // FIXED: Removed /api/ prefix
  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.due_date) {
      showNotificationMessage('Please fill in title and due date', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/assignments', {
        course_id: parseInt(id),
        title: newAssignment.title,
        description: newAssignment.description,
        due_date: `${newAssignment.due_date} ${newAssignment.due_time || '23:59:00'}`,
        total_points: newAssignment.total_points
      });

      if (response.data.success) {
        showNotificationMessage(`Assignment "${newAssignment.title}" created successfully!`, 'success');
        setShowAddAssignment(false);
        setNewAssignment({ title: '', description: '', due_date: '', due_time: '', total_points: 100 });
        fetchAssignments();
        fetchCourseData();
      } else {
        showNotificationMessage(response.data.message || 'Failed to create assignment', 'error');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      const newAssignmentObj = {
        id: assignments.length + 1,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.due_date,
        due_date: newAssignment.due_date,
        submissions: 0,
        total: course?.enrolledStudents || 45,
        status: 'Active',
        points: newAssignment.total_points
      };
      setAssignments([...assignments, newAssignmentObj]);
      showNotificationMessage(`Assignment "${newAssignment.title}" created (Demo Mode)`, 'success');
      setShowAddAssignment(false);
      setNewAssignment({ title: '', description: '', due_date: '', due_time: '', total_points: 100 });
    } finally {
      setLoading(false);
    }
  };

  const handleGradeStudent = (student, assignment) => {
    setSelectedStudent(student);
    setSelectedAssignment(assignment);
    setGradeData({ grade: '', feedback: '' });
    setShowGradeModal(true);
  };

  // FIXED: Removed /api/ prefix
  const handleSubmitGrade = async () => {
    if (!gradeData.grade) {
      showNotificationMessage('Please enter a grade', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/submissions/grade', {
        student_id: selectedStudent.id,
        assignment_id: selectedAssignment.id,
        grade: parseInt(gradeData.grade),
        feedback: gradeData.feedback
      });

      if (response.data.success) {
        showNotificationMessage(`Graded ${selectedStudent.name}: ${gradeData.grade}%`, 'success');
        setShowGradeModal(false);
        fetchStudents();
      } else {
        showNotificationMessage(response.data.message || 'Failed to submit grade', 'error');
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      const updatedStudents = students.map(s => 
        s.id === selectedStudent.id ? { ...s, grade: `${gradeData.grade}%` } : s
      );
      setStudents(updatedStudents);
      showNotificationMessage(`Graded ${selectedStudent.name}: ${gradeData.grade}% (Demo Mode)`, 'success');
      setShowGradeModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Announcement Functions
  // FIXED: Removed /api/ prefix
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showNotificationMessage('Please fill in title and content', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/announcements', {
        course_id: parseInt(id),
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        priority: newAnnouncement.priority
      });

      if (response.data.success) {
        showNotificationMessage('Announcement posted successfully!', 'success');
        setShowAddAnnouncement(false);
        setNewAnnouncement({ title: '', content: '', priority: 'medium' });
        fetchAnnouncements();
      } else {
        showNotificationMessage(response.data.message || 'Failed to post announcement', 'error');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      const newAnnouncementObj = {
        id: announcements.length + 1,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        date: new Date().toISOString().split('T')[0],
        priority: newAnnouncement.priority,
        author: user?.name || 'Instructor'
      };
      setAnnouncements([newAnnouncementObj, ...announcements]);
      showNotificationMessage('Announcement posted successfully! (Demo Mode)', 'success');
      setShowAddAnnouncement(false);
      setNewAnnouncement({ title: '', content: '', priority: 'medium' });
    } finally {
      setLoading(false);
    }
  };

  // Material Functions
  // FIXED: Removed /api/ prefix
  const handleUploadMaterial = async () => {
    if (!newMaterial.title || !newMaterial.file) {
      showNotificationMessage('Please select a file and enter title', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', newMaterial.file);
    formData.append('title', newMaterial.title);
    formData.append('course_id', id);

    try {
      const response = await api.post('/courses/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        showNotificationMessage('Material uploaded successfully!', 'success');
        setShowAddMaterial(false);
        setNewMaterial({ title: '', file: null });
        fetchMaterials();
      } else {
        showNotificationMessage(response.data.message || 'Failed to upload material', 'error');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      const fileSize = (newMaterial.file.size / (1024 * 1024)).toFixed(1);
      const fileType = newMaterial.file.name.split('.').pop();
      const newMaterialObj = {
        id: materials.length + 1,
        title: newMaterial.title,
        type: fileType,
        size: `${fileSize} MB`,
        uploaded_at: new Date().toISOString().split('T')[0]
      };
      setMaterials([...materials, newMaterialObj]);
      showNotificationMessage('Material uploaded successfully! (Demo Mode)', 'success');
      setShowAddMaterial(false);
      setNewMaterial({ title: '', file: null });
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Removed /api/ prefix
  const handleDownloadMaterial = async (material) => {
    try {
      const response = await api.get(`/courses/materials/${material.id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showNotificationMessage(`Downloading ${material.title}...`, 'success');
    } catch (error) {
      console.error('Error downloading material:', error);
      showNotificationMessage('Demo Mode: File download would start here', 'info');
    }
  };

  // Enrollment Functions
  // FIXED: Removed /api/ prefix
  const handleEnrollStudent = async () => {
    if (!enrollmentData.email) {
      showNotificationMessage('Please enter student email', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/courses/${id}/enroll`, {
        email: enrollmentData.email,
        name: enrollmentData.name
      });

      if (response.data.success) {
        showNotificationMessage(`Student enrolled successfully!`, 'success');
        setShowEnrollStudent(false);
        setEnrollmentData({ email: '', name: '' });
        fetchStudents();
        fetchCourseData();
      } else {
        showNotificationMessage(response.data.message || 'Failed to enroll student', 'error');
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      const newStudent = {
        id: students.length + 1,
        name: enrollmentData.name || enrollmentData.email.split('@')[0],
        email: enrollmentData.email,
        regNo: `UCC/DIT/2024/00${students.length + 1}`,
        grade: 'N/A',
        attendance: 0,
        status: 'Active',
        assignments_completed: 0,
        total_assignments: assignments.length || 4
      };
      setStudents([...students, newStudent]);
      showNotificationMessage(`Student enrolled successfully! (Demo Mode)`, 'success');
      setShowEnrollStudent(false);
      setEnrollmentData({ email: '', name: '' });
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Removed /api/ prefix
  const handleRemoveStudent = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from this course?`)) {
      setLoading(true);
      try {
        const response = await api.delete(`/courses/${id}/students/${studentId}`);
        if (response.data.success) {
          showNotificationMessage(`${studentName} removed from course`, 'success');
          fetchStudents();
          fetchCourseData();
        } else {
          showNotificationMessage(response.data.message || 'Failed to remove student', 'error');
        }
      } catch (error) {
        console.error('Error removing student:', error);
        setStudents(students.filter(s => s.id !== studentId));
        showNotificationMessage(`${studentName} removed from course (Demo Mode)`, 'success');
      } finally {
        setLoading(false);
      }
    }
  };

  // Analytics Functions
  // FIXED: Removed /api/ prefix
  const handleExportGrades = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${id}/export-grades`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades_${course?.code}_${course?.title}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showNotificationMessage('Grades exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting grades:', error);
      let csvContent = "Name,Email,Reg No,Grade,Attendance\n";
      students.forEach(s => {
        csvContent += `${s.name},${s.email},${s.regNo},${s.grade || 'N/A'},${s.attendance || 0}%\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `grades_${course?.code}_${course?.title}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showNotificationMessage('Grades exported successfully! (Demo Mode)', 'success');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Removed /api/ prefix
  const handleGenerateQRCode = async () => {
    setLoading(true);
    try {
      const response = await api.post('/attendance/generate-qr', {
        course_id: parseInt(id)
      });
      
      if (response.data.success && response.data.qr_code) {
        showNotificationMessage('QR Code generated! Students can scan for attendance.', 'success');
      } else {
        showNotificationMessage('QR Code generation feature coming soon', 'info');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      showNotificationMessage('Demo Mode: QR Code would be generated here', 'info');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Removed /api/ prefix
  const handleSendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await api.post(`/courses/${id}/send-message`, {
        message: message
      });
      
      if (response.data.success) {
        showNotificationMessage('Message sent to all students!', 'success');
      } else {
        showNotificationMessage('Message feature coming soon', 'info');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotificationMessage(`Demo Mode: Message would be sent to ${students.length} students`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/lecturer/dashboard');
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !course) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: colors.primary }}></div>
          <p className="mt-4" style={{ color: colors.textSecondary }}>Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>Course Not Found</h2>
          <button onClick={handleBack} className="px-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
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

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm mb-4 hover:opacity-70 transition" style={{ color: colors.primary }}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{course.image || '📚'}</div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{course.title}</h1>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{course.code} • {course.department} • {course.credits} credits</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">{course.status}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{course.semester}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGenerateQRCode} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <QrCode size={16} /> Attendance QR
              </button>
              <button onClick={() => setShowEnrollStudent(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                <UserPlus size={16} /> Enroll Student
              </button>
              <button onClick={handleExportGrades} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                <Download size={16} /> Export Grades
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition" style={{ border: `1px solid ${colors.border}` }} onClick={() => setActiveTab('students')}>
            <Users size={28} style={{ color: colors.primary }} className="mx-auto mb-2" />
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{students.length}</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Enrolled Students</div>
          </div>
          <div className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition" style={{ border: `1px solid ${colors.border}` }} onClick={() => setActiveTab('assignments')}>
            <FileText size={28} style={{ color: colors.primary }} className="mx-auto mb-2" />
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{assignments.length}</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Assignments</div>
          </div>
          <div className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition" style={{ border: `1px solid ${colors.border}` }} onClick={handleExportGrades}>
            <Award size={28} style={{ color: colors.primary }} className="mx-auto mb-2" />
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{course.avgGrade}%</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Average Grade</div>
          </div>
          <div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}>
            <Clock size={28} style={{ color: colors.primary }} className="mx-auto mb-2" />
            <div className="text-sm" style={{ color: colors.textPrimary }}>{course.schedule}</div>
            <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>{course.room}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b flex-wrap" style={{ borderColor: colors.border }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'materials', label: 'Materials', icon: FolderOpen },
            { id: 'announcements', label: 'Announcements', icon: Bell },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent', color: activeTab === tab.id ? colors.primary : colors.textSecondary }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Description</h2>
              <p className="mb-4" style={{ color: colors.textSecondary }}>{course.description}</p>
              <h3 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>Course Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Instructor:</span><span style={{ color: colors.textPrimary }}>{course.instructor}</span></div>
                <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Schedule:</span><span style={{ color: colors.textPrimary }}>{course.schedule}</span></div>
                <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Room:</span><span style={{ color: colors.textPrimary }}>{course.room}</span></div>
                <div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Semester:</span><span style={{ color: colors.textPrimary }}>{course.semester}</span></div>
              </div>
            </div>
            <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setShowAddAssignment(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}>
                  <span>📝 Create Assignment</span><Plus size={18} style={{ color: colors.primary }} />
                </button>
                <button onClick={() => setShowAddAnnouncement(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.secondary}10` }}>
                  <span>📢 Post Announcement</span><Bell size={18} style={{ color: colors.secondary }} />
                </button>
                <button onClick={() => setShowAddMaterial(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}>
                  <span>📁 Upload Material</span><Upload size={18} style={{ color: colors.primary }} />
                </button>
                <button onClick={() => setShowEnrollStudent(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}>
                  <span>👥 Enroll Student</span><UserPlus size={18} style={{ color: colors.primary }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Enrolled Students ({students.length})</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                  <input type="text" placeholder="Search students..." className="pl-10 pr-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setShowEnrollStudent(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><UserPlus size={16} /> Enroll</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: colors.border }}>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Reg No</th>
                    <th className="p-3 text-left">Grade</th>
                    <th className="p-3 text-left">Attendance</th>
                    <th className="p-3 text-left">Progress</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t" style={{ borderColor: colors.border }}>
                      <td className="p-3">
                        <div>
                          <div className="font-medium" style={{ color: colors.textPrimary }}>{student.name}</div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>{student.email}</div>
                        </div>
                      </td>
                      <td className="p-3" style={{ color: colors.textSecondary }}>{student.regNo}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{student.grade || 'N/A'}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                            <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${student.attendance || 85}%` }}></div>
                          </div>
                          <span className="text-xs">{student.attendance || 85}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${(student.assignments_completed || 0) / (student.total_assignments || 4) * 100}%`, backgroundColor: colors.primary }}></div>
                          </div>
                          <span className="text-xs">{student.assignments_completed || 0}/{student.total_assignments || 4}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleGradeStudent(student, assignments[0])} className="p-1 rounded" style={{ color: colors.primary }} title="Grade"><Edit size={16} /></button>
                          <button onClick={() => handleSendMessage(`Hello ${student.name}, how are you doing in the course?`)} className="p-1 rounded" style={{ color: colors.secondary }} title="Message"><MessageCircle size={16} /></button>
                          <button onClick={() => handleRemoveStudent(student.id, student.name)} className="p-1 rounded" style={{ color: colors.error }} title="Remove"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Assignments</h2>
              <button onClick={() => setShowAddAssignment(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Create Assignment</button>
            </div>
            <div className="space-y-3">
              {assignments.map(assignment => (
                <div key={assignment.id} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <h3 className="font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{assignment.description}</p>
                      <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>Due: {assignment.dueDate || assignment.due_date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{assignment.submissions || 0}/{assignment.total || students.length} submitted</div>
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${assignment.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>{assignment.status || 'Active'}</div>
                      <div className="text-xs mt-1" style={{ color: colors.primary }}>{assignment.points || 100} points</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 rounded text-xs" style={{ backgroundColor: colors.primary, color: '#000' }}>View Submissions</button>
                    <button onClick={() => handleGradeStudent({ name: 'All Students' }, assignment)} className="px-3 py-1 rounded text-xs" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Bulk Grade</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Materials</h2>
              <button onClick={() => setShowAddMaterial(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Upload size={16} /> Upload Material</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map(material => (
                <div key={material.id} className="p-4 rounded-lg flex justify-between items-center" style={{ backgroundColor: `${colors.primary}05`, border: `1px solid ${colors.border}` }}>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{material.title}</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>{material.type?.toUpperCase()} • {material.size} • Uploaded: {material.uploaded_at}</div>
                  </div>
                  <button onClick={() => handleDownloadMaterial(material)} className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Download size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2>
              <button onClick={() => setShowAddAnnouncement(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Bell size={16} /> Post Announcement</button>
            </div>
            <div className="space-y-3">
              {announcements.map(announcement => (
                <div key={announcement.id} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold" style={{ color: colors.textPrimary }}>{announcement.title}</h3>
                      <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{announcement.content}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-500' : announcement.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{announcement.priority}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span style={{ color: colors.textSubtle }}>Posted: {announcement.date} by {announcement.author || user?.name}</span>
                    <button onClick={() => handleSendMessage(announcement.title)} className="flex items-center gap-1" style={{ color: colors.primary }}><Send size={12} /> Send reminder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddAssignment(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Create Assignment</h3>
              <button onClick={() => setShowAddAssignment(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Assignment Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
              <textarea placeholder="Description" rows="3" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" placeholder="Due Date *" className="px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.due_date} onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})} />
                <input type="time" placeholder="Due Time" className="px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.due_time} onChange={(e) => setNewAssignment({...newAssignment, due_time: e.target.value})} />
              </div>
              <input type="number" placeholder="Total Points" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.total_points} onChange={(e) => setNewAssignment({...newAssignment, total_points: parseInt(e.target.value)})} />
              <button onClick={handleCreateAssignment} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Creating...' : 'Create Assignment'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showAddAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddAnnouncement(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Post Announcement</h3>
              <button onClick={() => setShowAddAnnouncement(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <textarea placeholder="Content *" rows="3" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button onClick={handleCreateAnnouncement} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Posting...' : 'Post Announcement'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddMaterial(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Upload Material</h3>
              <button onClick={() => setShowAddMaterial(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Material Title *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newMaterial.title} onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})} />
              <input type="file" onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})} className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} />
              <p className="text-xs" style={{ color: colors.textSecondary }}>Supported formats: PDF, DOC, DOCX, ZIP, JPG, PNG, MP4 (Max 50MB)</p>
              <button onClick={handleUploadMaterial} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Uploading...' : 'Upload Material'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEnrollStudent(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Enroll Student</h3>
              <button onClick={() => setShowEnrollStudent(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="email" placeholder="Student Email *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={enrollmentData.email} onChange={(e) => setEnrollmentData({...enrollmentData, email: e.target.value})} />
              <input type="text" placeholder="Student Name (Optional)" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={enrollmentData.name} onChange={(e) => setEnrollmentData({...enrollmentData, name: e.target.value})} />
              <button onClick={handleEnrollStudent} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Enrolling...' : 'Enroll Student'}</button>
              <p className="text-xs text-center" style={{ color: colors.textSecondary }}>Student will receive email notification with course access</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGradeModal(false)}>
          <div className="glass-card p-6 max-w-md w-full" style={{ backgroundColor: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Grade Student</h3>
              <button onClick={() => setShowGradeModal(false)}><X size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <p><strong style={{ color: colors.textPrimary }}>Student:</strong> <span style={{ color: colors.textSecondary }}>{selectedStudent.name}</span></p>
                <p className="mt-1"><strong style={{ color: colors.textPrimary }}>Assignment:</strong> <span style={{ color: colors.textSecondary }}>{selectedAssignment?.title}</span></p>
              </div>
              <input type="number" placeholder="Grade (0-100) *" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} />
              <textarea placeholder="Feedback (Optional)" rows="3" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={gradeData.feedback} onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})} />
              <button onClick={handleSubmitGrade} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Grade'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;