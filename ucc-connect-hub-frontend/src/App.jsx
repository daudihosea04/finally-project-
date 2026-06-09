import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/home/Home';
import About from './pages/about/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Courses from './pages/courses/Courses';
import Events from './pages/events/Events';
import Resources from './pages/resources/Resources';
import Contact from './pages/contact/Contact';
import Faq from './pages/faq/Faq';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';

// Dashboard Pages
import StudentDashboard from './pages/student/StudentDashboard';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './pages/lecturer/CourseManagement';

// Layout Components
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Role-Based Dashboard Redirect Component
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role === 'lecturer') {
    return <Navigate to="/lecturer/dashboard" replace />;
  }
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* ========== PUBLIC ROUTES ========== */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/admin" element={<Register />} />
                <Route path="/register/lecturer" element={<Register />} />
                <Route path="/register/student" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/events" element={<Events />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* ========== ADMIN ROUTES ========== */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

                {/* ========== LECTURER ROUTES ========== */}
                <Route path="/lecturer" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/dashboard" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/courses" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/courses/:id" element={<ProtectedRoute allowedRoles={['lecturer']}><CourseManagement /></ProtectedRoute>} />
                <Route path="/lecturer/assignments" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/grade" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/groups" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/announcements" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />
                <Route path="/lecturer/*" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerDashboard /></ProtectedRoute>} />

                {/* ========== STUDENT ROUTES ========== */}
                <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/grades" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/calendar" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

                {/* ========== ROLE-BASED DASHBOARD REDIRECT ========== */}
                <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;