import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Home from './pages/home/Home';
import About from './pages/about/About';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-Based Dashboard Selector
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  if (user?.role === 'lecturer') {
    return <LecturerDashboard />;
  }
  return <StudentDashboard />;
};

function App() {
  const { colors } = useTheme();

  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.background }}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Role-Based Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            } />
            
	    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard />		         </ProtectedRoute>} />
            {/* Direct Role Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/lecturer/*" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <LecturerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/student/*" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;