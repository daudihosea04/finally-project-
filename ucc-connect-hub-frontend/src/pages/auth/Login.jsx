import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield, AlertCircle } from 'lucide-react';

const Login = () => {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
    }
    
    try {
        const result = await login(formData.email, formData.password);
        
        if (result && result.user) {
            const role = result.user.role;
            console.log('User role:', role); // Debug log
            
            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else if (role === 'lecturer') {
                navigate('/lecturer/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    } catch (err) {
        setError(err.message || 'Invalid email or password');
    } finally {
        setLoading(false);
    }
};

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
            <Shield size={32} style={{ color: colors.primary }} />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
            Welcome Back
          </h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            Sign in to your UCC Connect Hub account
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8" style={{ border: `1px solid ${colors.border}` }}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: `${colors.error}20`, border: `1px solid ${colors.error}` }}
            >
              <AlertCircle size={18} style={{ color: colors.error }} />
              <span className="text-sm" style={{ color: colors.error }}>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
                  className="input-field pl-10"
                  style={{ border: `1px solid ${colors.border}` }}
                  disabled={loading}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>Use your UCC email address</p>
            </div>

            {/* Password Field */}
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
                  className="input-field pl-10 pr-10"
                  style={{ border: `1px solid ${colors.border}` }}
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: colors.primary }}
                />
                <span className="text-sm" style={{ color: colors.textSecondary }}>Remember me</span>
              </label>
              <Link 
                to="/forgot-password"
                className="text-sm hover:underline transition"
                style={{ color: colors.primary }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group"
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
                  Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:underline transition" style={{ color: colors.primary }}>
                Create Account
              </Link>
            </p>
          </div>

          {/* UCC Info */}
          <div className="mt-6 pt-4 text-center border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSubtle }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>
              © UCC Dodoma | Established 1999
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;