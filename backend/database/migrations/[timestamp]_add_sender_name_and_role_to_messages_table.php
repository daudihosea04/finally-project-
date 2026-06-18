// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            
            // Verify token with backend
            try {
              const response = await api.get('/user');
              if (response.data && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
              }
            } catch (error) {
              console.log('Token verification failed, but using stored user');
            }
          } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ============================================
  // LOGIN - FIXED
  // ============================================
  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt:', { email });
      
      setError(null);
      
      // ✅ Send login request
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('📦 Full login response:', response);
      console.log('📦 Response data:', response.data);

      // ✅ Check if login was successful
      if (response.data && response.data.success === true) {
        const { token, user: userData } = response.data;
        
        console.log('✅ Login successful!');
        console.log('👤 User data:', userData);
        console.log('🔑 Token:', token);

        // Save to localStorage
        if (token) {
          localStorage.setItem('token', token);
        }
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        return { 
          success: true, 
          user: userData,
          token: token
        };
      } else {
        // ❌ Login failed
        const message = response.data?.message || 'Invalid email or password. Please try again.';
        console.error('❌ Login failed:', message);
        setError(message);
        
        return { 
          success: false, 
          message: message 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let message = 'Invalid email or password. Please try again.';
      
      // ✅ Better error handling
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 401) {
          message = error.response.data?.message || 'Invalid email or password. Please try again.';
        } else if (error.response.status === 422) {
          const errors = error.response.data?.errors;
          if (errors) {
            const firstError = Object.values(errors)[0];
            message = Array.isArray(firstError) ? firstError[0] : 'Validation error. Please check your input.';
          }
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        }
      } else if (error.request) {
        message = 'No response from server. Please check your connection.';
      }
      
      setError(message);
      return { 
        success: false, 
        message: message 
      };
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ============================================
  // UPDATE USER
  // ============================================
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;