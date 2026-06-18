// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const { colors, isDark } = useTheme();
  const { login, user, isAuthenticated, loading: authLoading, reactivateAccount } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Default credentials for testing
  const [email, setEmail] = useState('student@ucc.ac.tz');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    console.log('🔍 Login useEffect - isAuthenticated:', isAuthenticated);
    console.log('🔍 Login useEffect - user:', user);
    
    if (isAuthenticated && user) {
      console.log('✅ Already logged in as:', user.role);
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectBasedOnRole = (role) => {
    console.log('🔄 Redirecting based on role:', role);
    if (role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'lecturer') {
      navigate('/lecturer/dashboard', { replace: true });
    } else if (role === 'student') {
      navigate('/student/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== LOGIN SUBMIT ===');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    
    setError('');
    setSuccess('');
    setIsInactive(false);
    setLoading(true);
    
    try {
      const result = await login(email, password);
      console.log('📦 Login result FULL:', result);
      console.log('📦 Login result.success:', result?.success);
      console.log('📦 Login result.user:', result?.user);
      console.log('📦 Login result.role:', result?.role);
      
      // ✅ FIX: Better success checking
      if (result && result.success === true) {
        setSuccess('✅ Login successful! Redirecting...');
        
        // ✅ FIX: Get role from multiple possible locations
        const userRole = result.user?.role || result.role || user?.role;
        console.log('🎭 User role detected:', userRole);
        
        setTimeout(() => {
          redirectBasedOnRole(userRole);
        }, 500);
      } else {
        // ✅ FIX: Better error message handling
        const errorMsg = result?.message || 'Invalid email or password. Please try again.';
        console.log('❌ Login failed:', errorMsg);
        console.log('❌ Full result object:', result);
        
        setError(errorMsg);
        
        if (errorMsg.toLowerCase().includes('not active') || 
            errorMsg.toLowerCase().includes('inactive') ||
            errorMsg.toLowerCase().includes('contact support') ||
            errorMsg.toLowerCase().includes('deactivated')) {
          setIsInactive(true);
        }
      }
    } catch (err) {
      console.error('❌ Login error (unexpected):', err);
      const errorMsg = err?.response?.data?.message || 
                       err?.message || 
                       'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      
      if (errorMsg.toLowerCase().includes('not active') || 
          errorMsg.toLowerCase().includes('inactive')) {
        setIsInactive(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role) => {
    console.log(`🔄 Filling credentials for: ${role}`);
    setError('');
    setSuccess('');
    setIsInactive(false);
    
    if (role === 'student') {
      setEmail('student@ucc.ac.tz');
      setPassword('password123');
    } else if (role === 'lecturer') {
      setEmail('lecturer@ucc.ac.tz');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@ucc.ac.tz');
      setPassword('password123');
    }
  };

  const handleReactivation = async () => {
    setReactivating(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await reactivateAccount(email);
      
      if (result.success) {
        setSuccess('✅ ' + result.message);
        setIsInactive(false);
        setError('');
      } else {
        setError('❌ ' + result.message);
      }
    } catch (err) {
      setError('Failed to reactivate account. Please contact support directly.');
      console.error('Reactivation error:', err);
    } finally {
      setReactivating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: colors?.background || '#0A0E17' }}>
      <div 
        className="max-w-md w-full p-8 rounded-2xl" 
        style={{ 
          backgroundColor: colors?.bgCard || '#1A1F2E',
          border: `1px solid ${colors?.border || 'rgba(255,215,0,0.2)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-3xl font-bold" style={{ color: colors?.textPrimary || '#FFFFFF' }}>Welcome Back</h2>
          <p className="mt-2" style={{ color: colors?.textSecondary || '#B0B8D0' }}>Sign in to your UCC Connect Hub account</p>
        </div>
        
        {success && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: '#00FF4420', border: '1px solid #00FF44' }}>
            <span style={{ color: '#00FF44' }}>✅</span>
            <span style={{ color: '#00FF44' }}>{success}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FF444420', border: '1px solid #FF4444' }}>
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle size={18} style={{ color: '#FF4444', marginTop: '1px' }} />
              <div>
                <span style={{ color: '#FF4444' }}>{error}</span>
                
                {isInactive && (
                  <div className="mt-3">
                    <p className="text-xs" style={{ color: colors?.textSecondary || '#B0B8D0' }}>
                      ⚠️ Your account appears to be inactive. Would you like to request reactivation?
                    </p>
                    <button
                      type="button"
                      onClick={handleReactivation}
                      disabled={reactivating}
                      className="mt-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 flex items-center gap-2"
                      style={{ 
                        backgroundColor: colors?.primary || '#FFD700',
                        color: '#000',
                        opacity: reactivating ? 0.6 : 1
                      }}
                    >
                      <RefreshCw size={14} className={reactivating ? 'animate-spin' : ''} />
                      {reactivating ? 'Processing...' : 'Request Reactivation'}
                    </button>
                    <p className="mt-2 text-xs" style={{ color: colors?.textSubtle || '#7A82A0' }}>
                      Or contact support at: <span className="font-mono" style={{ color: colors?.primary || '#FFD700' }}>support@ucc.ac.tz</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors?.textSecondary || '#B0B8D0' }}>
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors?.textSubtle || '#7A82A0' }} />
              <input 
                type="email" 
                className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ 
                  backgroundColor: colors?.background || '#0A0E17', 
                  borderColor: error ? '#FF4444' : (colors?.border || 'rgba(255,215,0,0.2)'), 
                  color: colors?.textPrimary || '#FFFFFF',
                  ringColor: colors?.primary || '#FFD700'
                }} 
                placeholder="student@ucc.ac.tz" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setIsInactive(false);
                }} 
                required 
                disabled={loading || authLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: colors?.textSecondary || '#B0B8D0' }}>
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors?.textSubtle || '#7A82A0' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2" 
                style={{ 
                  backgroundColor: colors?.background || '#0A0E17', 
                  borderColor: error ? '#FF4444' : (colors?.border || 'rgba(255,215,0,0.2)'), 
                  color: colors?.textPrimary || '#FFFFFF',
                  ringColor: colors?.primary || '#FFD700'
                }} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setIsInactive(false);
                }} 
                required 
                disabled={loading || authLoading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} style={{ color: colors?.textSubtle || '#7A82A0' }} /> : <Eye size={18} style={{ color: colors?.textSubtle || '#7A82A0' }} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" style={{ accentColor: colors?.primary || '#FFD700' }} />
              <span className="text-sm" style={{ color: colors?.textSecondary || '#B0B8D0' }}>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: colors?.primary || '#FFD700' }}>
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || authLoading} 
            className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            style={{ backgroundColor: colors?.primary || '#FFD700', color: '#000' }}
          >
            {loading || authLoading ? (
              <>
                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#000', borderTopColor: 'transparent' }}></div>
                Signing in...
              </>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm" style={{ color: colors?.textSecondary || '#B0B8D0' }}>
          Don't have an account? <Link to="/register" style={{ color: colors?.primary || '#FFD700' }} className="hover:underline">Sign up</Link>
        </p>
        
        {/* Quick Login Buttons */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: colors?.border || 'rgba(255,215,0,0.1)' }}>
          <p className="text-center text-xs mb-2" style={{ color: colors?.textSubtle || '#7A82A0' }}>Quick Login:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('student')}
              className="py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${colors?.primary || '#FFD700'}20`, 
                border: `1px solid ${colors?.primary || '#FFD700'}`, 
                color: colors?.textPrimary || '#FFFFFF' 
              }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('lecturer')}
              className="py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${colors?.primary || '#FFD700'}20`, 
                border: `1px solid ${colors?.primary || '#FFD700'}`, 
                color: colors?.textPrimary || '#FFFFFF' 
              }}
            >
              👨‍🏫 Lecturer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${colors?.primary || '#FFD700'}20`, 
                border: `1px solid ${colors?.primary || '#FFD700'}`, 
                color: colors?.textPrimary || '#FFFFFF' 
              }}
            >
              👑 Admin
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: colors?.textSubtle || '#7A82A0' }}>
            All accounts use: <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;