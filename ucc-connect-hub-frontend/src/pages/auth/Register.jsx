import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, AlertCircle, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

const Register = () => {
  const { colors, isDark } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (!formData.email.endsWith('@ucc.ac.tz')) {
      newErrors.email = 'Please use your @ucc.ac.tz email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.role === 'student' && !formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    }
    if (formData.role === 'lecturer' && !formData.department) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccess('');
    
    try {
      const { confirmPassword, ...submitData } = formData;
      const result = await register(submitData);
      
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Access courses, submit assignments, join groups' },
    { value: 'lecturer', label: 'Lecturer', icon: Briefcase, description: 'Create courses, grade assignments, manage groups' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ backgroundColor: colors.background }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 rounded-full w-[500px] h-[500px]" style={{ backgroundColor: `${colors.primary}08`, filter: 'blur(120px)' }}></div>
        <div className="absolute bottom-1/4 -right-32 rounded-full w-[400px] h-[400px]" style={{ backgroundColor: `${colors.secondary}08`, filter: 'blur(100px)' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
            <UserPlus size={32} style={{ color: colors.primary }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            Create Account
          </h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            Join UCC Connect Hub community
          </p>
        </div>

        {/* Register Card */}
        <div className="glass-card p-8" style={{ border: `1px solid ${colors.border}` }}>
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: `${colors.error}20`, border: `1px solid ${colors.error}` }}
            >
              <AlertCircle size={18} style={{ color: colors.error }} />
              <span className="text-sm" style={{ color: colors.error }}>{errors.general}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: `${colors.success}20`, border: `1px solid ${colors.success}` }}
            >
              <CheckCircle size={18} style={{ color: colors.success }} />
              <span className="text-sm" style={{ color: colors.success }}>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John M. Doe"
                  className={`input-field pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.fullName ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                />
              </div>
              {errors.fullName && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@ucc.ac.tz"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.email ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.email}</p>}
              <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>Use your UCC email address (@ucc.ac.tz)</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    className={`p-3 rounded-lg text-center transition-all ${
                      formData.role === role.value 
                        ? 'ring-2 ring-offset-2' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: formData.role === role.value ? `${colors.primary}20` : `${colors.border}`,
                      border: `1px solid ${formData.role === role.value ? colors.primary : colors.border}`,
                      ringColor: colors.primary
                    }}
                  >
                    <role.icon size={20} style={{ color: formData.role === role.value ? colors.primary : colors.textSecondary }} className="mx-auto mb-1" />
                    <span className="text-sm font-medium" style={{ color: formData.role === role.value ? colors.primary : colors.textSecondary }}>
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Student ID (conditional) */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Student ID Number
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., UCC/2024/12345"
                  className={`input-field ${errors.studentId ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.studentId ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                />
                {errors.studentId && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.studentId}</p>}
              </div>
            )}

            {/* Department (conditional for lecturer) */}
            {formData.role === 'lecturer' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`input-field ${errors.department ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.department ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Business IT">Business Information Technology</option>
                  <option value="Network Security">Network Security</option>
                </select>
                {errors.department && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.department}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.password ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.textSubtle }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.password}</p>}
              <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>Password must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  style={{ border: `1px solid ${errors.confirmPassword ? '#ef4444' : colors.border}` }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.textSubtle }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group mt-6"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                color: isDark ? '#000' : '#fff',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }}></div>
              ) : (
                <>
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline transition" style={{ color: colors.primary }}>
                Sign In
              </Link>
            </p>
          </div>

          {/* UCC Info */}
          <div className="mt-6 pt-4 text-center border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSubtle }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>
              © UCC Dodoma | NACTVET Registered | UDSM Accredited Programme
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;