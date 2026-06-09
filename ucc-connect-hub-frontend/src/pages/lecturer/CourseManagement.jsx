import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Users, FileText, Clock, Calendar, 
  Edit, Trash2, Plus, Upload, Download, Eye,
  CheckCircle, XCircle, AlertCircle, BarChart3,
  MessageCircle, Bell, Settings, MoreVertical,
  ChevronRight, Search, Filter, Star, Award
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
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = () => {
    setLoading(true);
    
    const courseData = {
      1: {
        id: 1,
        title: 'Advanced Web Development',
        code: 'CS401',
        description: 'This course covers modern web development technologies including React, Node.js, Express, and MongoDB.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Sarah Johnson',
        schedule: 'Monday & Wednesday, 2:00 PM - 4:00 PM',
        room: 'Lab 301',
        semester: 'Semester 1, 2025/2026',
        status: 'Active',
        enrolledStudents: 45,
        assignmentsCount: 4,
        avgGrade: 78.5,
        image: '💻'
      },
      2: {
        id: 2,
        title: 'Database Systems',
        code: 'CS302',
        description: 'Introduction to database design, SQL, normalization, and database management systems.',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Prof. Michael Chen',
        schedule: 'Tuesday & Thursday, 10:00 AM - 12:00 PM',
        room: 'Lab 205',
        semester: 'Semester 1, 2025/2026',
        status: 'Active',
        enrolledStudents: 38,
        assignmentsCount: 3,
        avgGrade: 82.3,
        image: '🗄️'
      },
      3: {
        id: 3,
        title: 'Data Structures & Algorithms',
        code: 'CS301',
        description: 'Study of fundamental data structures and algorithms including trees, graphs, sorting, and searching.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Emily Rodriguez',
        schedule: 'Monday & Friday, 9:00 AM - 11:00 AM',
        room: 'Lab 102',
        semester: 'Semester 1, 2025/2026',
        status: 'Active',
        enrolledStudents: 42,
        assignmentsCount: 4,
        avgGrade: 75.6,
        image: '📊'
      }
    };

    const studentsData = {
      1: [
        { id: 1, name: 'John Doe', email: 'john@ucc.ac.tz', regNo: 'UCC/DIT/2024/001', grade: 'A-', attendance: 92, status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@ucc.ac.tz', regNo: 'UCC/DIT/2024/002', grade: 'B+', attendance: 88, status: 'Active' },
      ],
      2: [
        { id: 1, name: 'Alice Johnson', email: 'alice@ucc.ac.tz', regNo: 'UCC/DIT/2024/006', grade: 'A', attendance: 94, status: 'Active' },
      ],
      3: [
        { id: 1, name: 'Eva Green', email: 'eva@ucc.ac.tz', regNo: 'UCC/DIT/2024/008', grade: 'A-', attendance: 91, status: 'Active' },
      ]
    };

    const assignmentsData = {
      1: [
        { id: 1, title: 'React.js Project', dueDate: '2025-03-25', submissions: 32, total: 45, status: 'Active' },
        { id: 2, title: 'Node.js API', dueDate: '2025-04-05', submissions: 28, total: 45, status: 'Active' },
      ],
      2: [
        { id: 1, title: 'SQL Assignment', dueDate: '2025-03-20', submissions: 38, total: 38, status: 'Graded' },
      ],
      3: [
        { id: 1, title: 'Algorithm Analysis', dueDate: '2025-03-28', submissions: 35, total: 42, status: 'Graded' },
      ]
    };

    setCourse(courseData[id] || courseData[1]);
    setStudents(studentsData[id] || studentsData[1]);
    setAssignments(assignmentsData[id] || assignmentsData[1]);
    
    setLoading(false);
  };

  const showAlert = (message) => {
    setNotification({ show: true, message, type: 'success' });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleBack = () => {
    navigate('/lecturer/dashboard');
  };

  const handleViewStudent = (student) => {
    showAlert(`Viewing ${student.name}'s profile - Full details will be available soon.`);
  };

  const handleGradeStudent = (student) => {
    showAlert(`Grading ${student.name} - Grade entry form will open here.`);
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      showAlert(`Assignment "${newAssignment.title}" created successfully!`);
      setShowAddAssignment(false);
      setNewAssignment({ title: '', description: '', dueDate: '', points: 100 });
    } else {
      showAlert('Please fill in all required fields');
    }
  };

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      showAlert(`Announcement "${newAnnouncement.title}" posted successfully!`);
      setShowAddAnnouncement(false);
      setNewAnnouncement({ title: '', content: '', priority: 'Medium' });
    } else {
      showAlert('Please fill in all required fields');
    }
  };

  const handleEditCourse = () => {
    showAlert(`Editing course information - Edit form will appear here.`);
  };

  const handleExportGrades = () => {
    showAlert(`Exporting grades for ${course?.title} - CSV file will be downloaded.`);
  };

  const handleSendMessage = () => {
    showAlert(`Send message to all students in ${course?.title} - Message composer will open.`);
  };

  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', points: 100 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'Medium' });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p style={{ color: colors.textSecondary }}>Loading course data...</p>
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
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="p-4 rounded-lg shadow-lg flex items-center gap-3 bg-green-500">
            <CheckCircle size={20} className="text-white" />
            <span className="text-white">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm mb-4 hover:opacity-70 transition" style={{ color: colors.primary }}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{course.image}</div>
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
              <button onClick={handleEditCourse} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Edit size={16} /> Edit Course</button>
              <button onClick={handleSendMessage} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><MessageCircle size={16} /> Message Students</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><Users size={28} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold">{course.enrolledStudents}</div><div className="text-sm">Enrolled Students</div></div>
          <div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><FileText size={28} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold">{course.assignmentsCount}</div><div className="text-sm">Assignments</div></div>
          <div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><Award size={28} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold">{course.avgGrade}%</div><div className="text-sm">Average Grade</div></div>
          <div className="glass-card p-4 text-center" style={{ border: `1px solid ${colors.border}` }}><Clock size={28} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-sm">{course.schedule}</div><div className="text-xs mt-1">{course.room}</div></div>
        </div>

        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent', color: activeTab === tab.id ? colors.primary : colors.textSecondary }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

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
                <button onClick={() => setShowAddAssignment(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}><span>📝 Create Assignment</span><Plus size={18} style={{ color: colors.primary }} /></button>
                <button onClick={() => setShowAddAnnouncement(true)} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.secondary}10` }}><span>📢 Post Announcement</span><Bell size={18} style={{ color: colors.secondary }} /></button>
                <button onClick={handleExportGrades} className="w-full text-left p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: `${colors.primary}10` }}><span>📊 Export Grades</span><Download size={18} style={{ color: colors.primary }} /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Enrolled Students ({students.length})</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input type="text" placeholder="Search students..." className="pl-10 pr-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                    <th className="p-3 text-left">Status</th>
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
                      <td className="p-3">{student.regNo}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{student.grade}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                            <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${student.attendance}%` }}></div>
                          </div>
                          <span className="text-xs">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{student.status}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleViewStudent(student)} className="p-1 rounded" style={{ color: colors.primary }}><Eye size={16} /></button>
                          <button onClick={() => handleGradeStudent(student)} className="p-1 rounded" style={{ color: colors.secondary }}><Edit size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                      <p className="text-sm" style={{ color: colors.textSecondary }}>Due: {assignment.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{assignment.submissions}/{assignment.total} submitted</div>
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${assignment.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>{assignment.status}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 rounded text-xs" style={{ backgroundColor: colors.primary, color: '#000' }}>View Submissions</button>
                    <button className="px-3 py-1 rounded text-xs" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Course Announcements</h2>
              <button onClick={() => setShowAddAnnouncement(true)} className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}><Bell size={16} /> Post Announcement</button>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                <h3 className="font-bold">Welcome to the Course!</h3>
                <p className="text-sm mt-1">Please review the course syllabus and schedule.</p>
                <div className="text-xs mt-2" style={{ color: colors.textSubtle }}>Posted: Jan 15, 2025 • Sent to 45 students</div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                <h3 className="font-bold">Assignment 1 Deadline Extended</h3>
                <p className="text-sm mt-1">The deadline for Assignment 1 has been extended to March 28th.</p>
                <div className="text-xs mt-2" style={{ color: colors.textSubtle }}>Posted: Mar 18, 2025 • Sent to 45 students</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>Course Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                <span>Course Status</span>
                <button onClick={() => showAlert('Toggle course status')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Archive Course</button>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
                <span>Student Enrollment</span>
                <button onClick={() => showAlert('Open enrollment settings')} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Manage Enrollment</button>
              </div>
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
              <button onClick={() => setShowAddAssignment(false)}><XCircle size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Assignment Title" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
              <textarea placeholder="Description" rows="3" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
              <input type="date" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
              <input type="number" placeholder="Total Points" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAssignment.points} onChange={(e) => setNewAssignment({...newAssignment, points: e.target.value})} />
              <button onClick={handleCreateAssignment} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Create Assignment</button>
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
              <button onClick={() => setShowAddAnnouncement(false)}><XCircle size={20} style={{ color: colors.textSecondary }} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Title" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <textarea placeholder="Content" rows="3" className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
              <select className="w-full px-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={newAnnouncement.priority} onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button onClick={handleCreateAnnouncement} className="w-full py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Post Announcement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;