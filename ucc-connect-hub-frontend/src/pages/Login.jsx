import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('student@ucc.ac.tz');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Attempting login with:', email, password);
    
    const result = await login(email, password);
    
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful! Redirecting...');
      if (result.user?.role === 'lecturer') {
        navigate('/lecturer/dashboard');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
      console.error('Login failed:', result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f1a' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 max-w-md w-full mx-4"
        style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,215,0,0.2)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#FFD700' }}>UCC Connect Hub</h1>
          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
              style={{
                backgroundColor: '#0f0f1a',
                borderColor: '#333',
                color: '#fff'
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500"
              style={{
                backgroundColor: '#0f0f1a',
                borderColor: '#333',
                color: '#fff'
              }}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: '#FFD700', color: '#000' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="font-semibold mb-1" style={{ color: '#FFD700' }}>Test Credentials:</p>
          <p>📚 Student: student@ucc.ac.tz / password</p>
          <p>👨‍🏫 Lecturer: lecturer@ucc.ac.tz / password</p>
          <p>👑 Admin: admin@ucc.ac.tz / password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;