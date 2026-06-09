import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
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
      setError(result.message || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-md w-full glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Welcome Back</h2>
          <p className="mt-2" style={{ color: colors.textSecondary }}>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg text-center text-sm" style={{ backgroundColor: '#FF444420', color: '#FF4444' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors.textSecondary }}>Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
              <input 
                type="email" 
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary, ringColor: colors.primary }} 
                placeholder="student@ucc.ac.tz" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
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
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
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
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" style={{ accentColor: colors.primary }} />
              <span className="text-sm" style={{ color: colors.textSecondary }}>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm" style={{ color: colors.primary }}>Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary, color: '#000' }}
          >
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm" style={{ color: colors.textSecondary }}>
          Don't have an account? <Link to="/register" style={{ color: colors.primary }}>Sign up</Link>
        </p>
        
        <div className="mt-6 pt-4 border-t text-center text-xs" style={{ borderColor: colors.border, color: colors.textSubtle }}>
          <p className="mb-1">Demo Accounts:</p>
          <p>🎓 Student: student@ucc.ac.tz / password</p>
          <p>👨‍🏫 Lecturer: lecturer@ucc.ac.tz / password</p>
          <p>👑 Admin: admin@ucc.ac.tz / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;