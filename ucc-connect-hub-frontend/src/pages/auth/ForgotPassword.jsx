import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Shield, Send } from 'lucide-react';

const ForgotPassword = () => {
  const { colors, isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate email
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
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
            Forgot Password
          </h1>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            We'll send you a reset link to your email
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="glass-card p-8" style={{ border: `1px solid ${colors.border}` }}>
          {!success ? (
            <>
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
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@ucc.ac.tz"
                      className="input-field pl-10"
                      style={{ border: `1px solid ${colors.border}` }}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.textSubtle }}>
                    Enter your registered UCC email address
                  </p>
                </div>

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
                      Send Reset Link <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.success}20` }}>
                <CheckCircle size={40} style={{ color: colors.success }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Check Your Email</h2>
              <p className="mb-4" style={{ color: colors.textSecondary }}>
                We've sent a password reset link to<br />
                <strong style={{ color: colors.primary }}>{email}</strong>
              </p>
              <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: `${colors.primary}10` }}>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  <strong>Didn't receive the email?</strong><br />
                  Check your spam folder or make sure you entered the correct email address.
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-sm font-semibold hover:underline"
                style={{ color: colors.primary }}
              >
                Try another email address
              </button>
            </motion.div>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold hover:underline transition flex items-center justify-center gap-1" style={{ color: colors.primary }}>
              <ArrowRight size={14} className="rotate-180" /> Back to Sign In
            </Link>
          </div>

          {/* UCC Support Info */}
          <div className="mt-6 pt-4 text-center border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs" style={{ color: colors.textSubtle }}>
              Need help? Contact UCC IT Support
            </p>
            <p className="text-xs" style={{ color: colors.textSubtle }}>
              📧 support@ucc.ac.tz | 📞 +255 123 456 789
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;