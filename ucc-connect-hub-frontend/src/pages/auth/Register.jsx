// frontend/src/pages/auth/Register.jsx (Modified - Direct API call)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Phone, Calendar, BookOpen } from 'lucide-react';
import api from '../../services/api';

const Register = () => {
  const { colors, isDark } = useTheme();
  const { login } = useAuth(); // Only use login, not register
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    course: '',
    start_date: '',
    end_date: '',
    password: '', 
    password_confirmation: '',
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const courses = [
    { id: 1, name: 'Bachelor of Science in Computer Science', duration: '3 years' },
    { id: 2, name: 'Bachelor of Information Technology', duration: '3 years' },
    { id: 3, name: 'Diploma in Computer Science', duration: '2 years' },
    { id: 4, name: 'Diploma in Information Technology', duration: '2 years' },
    { id: 5, name: 'Certificate in Computer Applications', duration: '1 year' },
    { id: 6, name: 'Certificate in Networking', duration: '1 year' },
    { id: 7, name: 'Advanced Diploma in Software Engineering', duration: '3 years' },
    { id: 8, name: 'Professional Certificate in Web Development', duration: '6 months' },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/register/admin')) {
      setFormData(prev => ({ ...prev, role: 'admin' }));
    } else if (path.includes('/register/lecturer')) {
      setFormData(prev => ({ ...prev, role: 'lecturer' }));
    } else {
      setFormData(prev => ({ ...prev, role: 'student' }));
    }
  }, [location.pathname]);

  const getRoleInfo = () => {
    switch(formData.role) {
      case 'admin':
        return { name: 'Administrator', color: '#FFD700', icon: '👑', description: 'Unaweza kusimamia mfumo mzima' };
      case 'lecturer':
        return { name: 'Lecturer', color: '#00E5FF', icon: '👨‍🏫', description: 'Unaweza kuunda masomo na kutia alama' };
      default:
        return { name: 'Student', color: '#32CD32', icon: '👨‍🎓', description: 'Unaweza kuona masomo na kuwasilisha kazi' };
    }
  };

  const roleInfo = getRoleInfo();
  const isStudent = formData.role === 'student';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    if (isStudent) {
      if (!formData.phone) {
        setError('Phone number is required');
        return;
      }
      if (!formData.course) {
        setError('Please select a course');
        return;
      }
      if (!formData.start_date) {
        setError('Start date is required');
        return;
      }
      if (!formData.end_date) {
        setError('End date is required');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      let endpoint = '/auth/student-register';
      if (formData.role === 'lecturer') {
        endpoint = '/auth/lecturer-register';
      } else if (formData.role === 'admin') {
        endpoint = '/auth/admin-register';
      }
      
      const response = await api.post(endpoint, formData);
      
      if (response.data.success) {
        // Auto login after registration
        const loginResult = await login(formData.email, formData.password);
        
        if (loginResult.success) {
          const role = loginResult.user.role;
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'lecturer') {
            navigate('/lecturer/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        } else {
          navigate('/login');
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages[0]);
      } else {
        setError(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-2xl w-full glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{roleInfo.icon}</div>
          <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${roleInfo.color}20`, color: roleInfo.color }}>
            {roleInfo.name} Registration
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Create Account</h2>
          <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>{roleInfo.description}</p>
          {isStudent && <p className="text-xs text-green-600 mt-1">✓ Instant activation - Start using immediately!</p>}
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm" style={{ backgroundColor: '#FF444420', color: '#FF4444' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Full Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input 
                  type="text" 
                  name="name"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address *</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input 
                  type="email" 
                  name="email"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                  placeholder="you@ucc.ac.tz" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {isStudent && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Phone Number *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                    <input 
                      type="tel" 
                      name="phone"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                      placeholder="0712345678" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Select Course *</label>
                  <div className="relative">
                    <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                    <select 
                      name="course"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 appearance-none" 
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                      value={formData.course} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select your course --</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.name}>
                          {course.name} ({course.duration})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Start Date *</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                    <input 
                      type="date" 
                      name="start_date"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                      value={formData.start_date} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>End Date *</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                    <input 
                      type="date" 
                      name="end_date"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                      style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                      value={formData.end_date} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} style={{ color: colors.textSubtle }} /> : <Eye size={18} style={{ color: colors.textSubtle }} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Confirm Password *</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="password_confirmation"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                  style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                  placeholder="••••••••" 
                  value={formData.password_confirmation} 
                  onChange={handleChange} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={18} style={{ color: colors.textSubtle }} /> : <Eye size={18} style={{ color: colors.textSubtle }} />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg text-center text-sm" style={{ backgroundColor: `${roleInfo.color}10`, border: `1px solid ${roleInfo.color}30` }}>
            <span style={{ color: roleInfo.color }}>
              📝 You are registering as a <strong>{roleInfo.name}</strong>
              {isStudent && " - Complete all fields above"}
            </span>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary, color: '#000' }}
          >
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Register as {roleInfo.name}</>}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm" style={{ color: colors.textSecondary }}>
          Already have an account? <Link to="/login" style={{ color: colors.primary }}>Sign in</Link>
        </p>

        <div className="mt-6 pt-4 border-t text-center text-xs" style={{ borderColor: colors.border, color: colors.textSubtle }}>
          <p className="mb-2">Register using role-specific links:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/register/student" className="px-2 py-1 rounded" style={{ backgroundColor: '#32CD3220', color: '#32CD32' }}>🎓 Student</Link>
            <Link to="/register/lecturer" className="px-2 py-1 rounded" style={{ backgroundColor: '#00E5FF20', color: '#00E5FF' }}>👨‍🏫 Lecturer</Link>
            <Link to="/register/admin" className="px-2 py-1 rounded" style={{ backgroundColor: '#FFD70020', color: '#FFD700' }}>👑 Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;