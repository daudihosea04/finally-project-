import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { colors, isDark } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '',
    role: 'student' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: formData.role
    };
    
    const result = await register(userData);
    
    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'lecturer') {
        navigate('/lecturer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md w-full glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{roleInfo.icon}</div>
          <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${roleInfo.color}20`, color: roleInfo.color }}>
            {roleInfo.name} Registration
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Create Account</h2>
          <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>{roleInfo.description}</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm" style={{ backgroundColor: '#FF444420', color: '#FF4444' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type="text" 
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type="email" 
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                placeholder="you@ucc.ac.tz" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
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
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                placeholder="••••••••" 
                value={formData.password_confirmation} 
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} 
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
          
          <div className="p-3 rounded-lg text-center text-sm" style={{ backgroundColor: `${roleInfo.color}10`, border: `1px solid ${roleInfo.color}30` }}>
            <span style={{ color: roleInfo.color }}>
              📝 You are registering as a <strong>{roleInfo.name}</strong>
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