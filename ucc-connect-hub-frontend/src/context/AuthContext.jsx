// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Create context
const AuthContext = createContext();

// Custom hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // ===== LOAD USER FROM LOCALSTORAGE =====
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('🔍 AuthProvider loading...', { 
      hasToken: !!storedToken, 
      hasUser: !!storedUser 
    });
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('✅ User restored:', userData.role);
        console.log('✅ User data:', userData);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    } else {
      console.log('ℹ️ No user/token found in localStorage');
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, []);

  // ===== LOGIN - ENHANCED ERROR HANDLING =====
  const login = async (email, password) => {
    console.log('🔐 Attempting login...');
    console.log('📧 Email:', email);
    setError(null);
    
    try {
      // ✅ FIX: Using correct API endpoint
      const response = await api.post('/auth/login', { email, password });
      
      console.log('📨 Login response FULL:', response);
      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', response.headers);
      console.log('📨 Response data:', response.data);
      console.log('📨 Response data type:', typeof response.data);
      
      // ✅ FIX: Parse response if it's a string
      let responseData = response.data;
      if (typeof responseData === 'string') {
        try {
          responseData = JSON.parse(responseData);
          console.log('📨 Parsed string response to object:', responseData);
        } catch (parseError) {
          console.error('❌ Failed to parse response string:', parseError);
          return { 
            success: false, 
            message: 'Invalid server response format' 
          };
        }
      }
      
      // Check if login was successful
      if (responseData && responseData.success) {
        const { token: newToken, user: userData } = responseData;
        
        if (!newToken) {
          const errorMsg = 'No token received from server';
          setError(errorMsg);
          console.error('❌', errorMsg);
          return { 
            success: false, 
            message: errorMsg,
            status: 500
          };
        }
        
        if (!userData) {
          const errorMsg = 'No user data received from server';
          setError(errorMsg);
          console.error('❌', errorMsg);
          return { 
            success: false, 
            message: errorMsg,
            status: 500
          };
        }
        
        console.log('✅ Token received:', newToken.substring(0, 20) + '...');
        console.log('✅ User data received:', userData);
        console.log('✅ User role:', userData.role);
        
        // ✅ Save to localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // ✅ Set axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // ✅ Update state
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
        
        console.log('✅ Login successful! Role:', userData.role);
        console.log('✅ isAuthenticated set to true');
        
        return {
          success: true,
          user: userData,
          role: userData.role,
          token: newToken,
          message: responseData.message || 'Login successful'
        };
      }
      
      // Handle unsuccessful response (success: false from backend)
      const errorMsg = responseData?.message || 'Login failed. Please try again.';
      const errorStatus = response.status || 401;
      
      console.log('❌ Login unsuccessful:', {
        message: errorMsg,
        status: errorStatus,
        data: responseData
      });
      
      setError(errorMsg);
      
      return {
        success: false,
        message: errorMsg,
        status: errorStatus,
        data: responseData
      };
      
    } catch (error) {
      console.error('❌ Login error caught:', error);
      console.error('❌ Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message
      });
      
      let errorMsg = 'Login failed. Please try again.';
      let errorStatus = error.response?.status || 500;
      
      // Enhanced error handling - capture ALL backend messages
      if (!error.response) {
        errorMsg = 'Network error. Please check your connection and try again.';
        console.error('❌ Network error - no response from server');
      } else if (error.response?.status === 401) {
        errorMsg = error.response?.data?.message || 'Invalid credentials. Please try again.';
        console.log('🔑 401 Unauthorized:', errorMsg);
      } else if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          errorMsg = Array.isArray(firstError) ? firstError[0] : 'Validation error';
        } else {
          errorMsg = error.response?.data?.message || 'Validation error';
        }
        console.log('⚠️ 422 Validation error:', errorMsg);
      } else if (error.response?.status === 403) {
        errorMsg = error.response?.data?.message || 'Access denied.';
        console.log('🚫 403 Forbidden:', errorMsg);
      } else if (error.response?.status === 404) {
        errorMsg = error.response?.data?.message || 'Endpoint not found.';
        console.log('🔍 404 Not found:', errorMsg);
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
        console.log('❌ Server error:', errorMsg);
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
        console.log('❌ Server error (error field):', errorMsg);
      }
      
      // Check for specific error patterns
      if (errorMsg.toLowerCase().includes('not active') || 
          errorMsg.toLowerCase().includes('inactive') ||
          errorMsg.toLowerCase().includes('contact support')) {
        console.log('⚠️ Inactive account detected');
      }
      
      setError(errorMsg);
      
      return {
        success: false,
        message: errorMsg,
        status: errorStatus,
        data: error.response?.data
      };
    }
  };

  // ===== LOGOUT =====
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('👋 Logged out successfully');
    }
  };

  // ===== REACTIVATE ACCOUNT =====
  const reactivateAccount = async (email) => {
    try {
      console.log('🔄 Reactivating account:', email);
      const response = await api.post('/auth/reactivate', { email });
      
      if (response.data && response.data.success) {
        console.log('✅ Account reactivated successfully');
        return {
          success: true,
          message: response.data.message || 'Account reactivated successfully'
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Reactivation failed'
      };
    } catch (error) {
      console.error('❌ Reactivation error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to reactivate account';
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // ===== REGISTER =====
  const register = async (userData) => {
    try {
      let endpoint = '/auth/student-register';
      if (userData.role === 'lecturer') endpoint = '/auth/lecturer-register';
      if (userData.role === 'admin') endpoint = '/auth/admin-register';
      
      const response = await api.post(endpoint, userData);
      
      if (response.data && response.data.success) {
        const { token: newToken, user: userDataResponse } = response.data;
        
        if (newToken && userDataResponse) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(userDataResponse));
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          setToken(newToken);
          setUser(userDataResponse);
          setIsAuthenticated(true);
          setError(null);
        }
        
        return {
          success: true,
          user: userDataResponse,
          message: response.data.message || 'Registration successful'
        };
      }
      
      const errorMsg = response.data?.message || 'Registration failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
      
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      
      if (response.data && response.data.success) {
        const updatedUser = { ...user, ...response.data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setError(null);
        return {
          success: true,
          user: updatedUser,
          message: response.data.message || 'Profile updated'
        };
      }
      
      const errorMsg = response.data?.message || 'Update failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
      
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMsg = error.response?.data?.message || 'Update failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // ===== CHANGE PASSWORD =====
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
      });
      
      if (response.data && response.data.success) {
        setError(null);
        return {
          success: true,
          message: response.data.message || 'Password changed'
        };
      }
      
      const errorMsg = response.data?.message || 'Password change failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
      
    } catch (error) {
      console.error('Change password error:', error);
      const errorMsg = error.response?.data?.message || 'Password change failed';
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  // ===== HELPER FUNCTIONS =====
  const isAdmin = user?.role === 'admin';
  const isLecturer = user?.role === 'lecturer';
  const isStudent = user?.role === 'student';

  const getDashboardRoute = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isLecturer) return '/lecturer/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/';
  };

  const value = {
    user,
    loading,
    token,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    reactivateAccount,
    updateProfile,
    changePassword,
    isAdmin,
    isLecturer,
    isStudent,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for Fast Refresh compatibility
export default AuthContext;