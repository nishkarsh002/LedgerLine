import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const path = window.location.pathname;
      const isAdminPath = path.startsWith('/admin');
      let token = isAdminPath ? localStorage.getItem('admin_token') : localStorage.getItem('token');
      
      // Check for token in URL (e.g. from Google OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        token = urlToken;
        // If we are on an admin path, save as admin_token
        const key = isAdminPath ? 'admin_token' : 'token';
        localStorage.setItem(key, urlToken);

        // Remove token from URL for security
        urlParams.delete('token');
        const newSearch = urlParams.toString();
        const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState({}, document.title, newPath);
      }

      if (token) {
        try {
          // Headers are handled by interceptor, so we just call /me
          const { data } = await api.get('/auth/me');

          if (data.success) {
            setUser(data.data);
            setIsLoggedIn(true);
            setIsAdmin(data.data.role === 'admin' || data.data.role === 'ca');
          } else {
            const key = isAdminPath ? 'admin_token' : 'token';
            localStorage.removeItem(key);
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          const key = isAdminPath ? 'admin_token' : 'token';
          localStorage.removeItem(key);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (userData) => {
    // Expecting userData to contain email and password
    try {
      const { data } = await api.post('/auth/login', userData);

      if (data.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: data.email,
          message: data.message
        };
      }

      if (data.success) {
        const isAdminUser = data.data?.role === 'admin' || data.data?.role === 'ca';
        const tokenKey = isAdminUser ? 'admin_token' : 'token';
        localStorage.setItem(tokenKey, data.token);
        
        // Use the token directly for the follow-up request to ensure correct user info
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin' || userResponse.data.data.role === 'ca');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
    return { success: false, message: 'Login failed' };
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);

      if (data.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: data.email,
          message: data.message
        };
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        // Fetch full user details
        const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${data.token}` }
        });
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin' || userResponse.data.data.role === 'ca');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.requireVerification) {
        return {
          success: false,
          requireVerification: true,
          email: userData.email, // Best guess
          message: error.response.data.message
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
    return { success: false, message: 'Registration failed' };
  };

  const verifyOTP = async (otpData) => {
    try {
      const { data } = await api.post('/auth/verify-otp', otpData);
      if (data.success) {
        const isAdminUser = data.data?.role === 'admin' || data.data?.role === 'ca';
        const tokenKey = isAdminUser ? 'admin_token' : 'token';
        localStorage.setItem(tokenKey, data.token);

        const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${data.token}` }
        });
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          setIsLoggedIn(true);
          setIsAdmin(userResponse.data.data.role === 'admin' || userResponse.data.data.role === 'ca');
          return { success: true };
        }
      }
    } catch (error) {
      console.error("OTP Verification Error", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Verification failed'
      };
    }
    return { success: false, message: 'Verification failed' };
  };

  const resendOTP = async (email) => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      if (data.success) {
        return { success: true, message: data.message };
      }
    } catch (error) {
      console.error("Resend OTP Error", error);
      return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
    }
    return { success: false, message: 'Failed to resend OTP' };
  };

  const sendMobileOTP = async (mobile) => {
    try {
      const { data } = await api.post('/auth/send-mobile-otp', { mobile });
      if (data.success) {
        return { success: true, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send Mobile OTP' };
    }
    return { success: false, message: 'Failed to send Mobile OTP' };
  };

  const verifyMobileOTP = async (otp) => {
    try {
      const { data } = await api.post('/auth/verify-mobile-otp', { otp });
      if (data.success) {
        const userResponse = await api.get('/auth/me');
        if (userResponse.data.success) {
          setUser(userResponse.data.data);
          return { success: true };
        }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Mobile verification failed' };
    }
    return { success: false, message: 'Mobile verification failed' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_token');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  // Add interceptor for 401/Unauthorized errors
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token is invalid or user was deleted
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Background polling to check session validity every 15 seconds
  useEffect(() => {
    let interval;
    if (isLoggedIn) {
      interval = setInterval(async () => {
        try {
          const { data } = await api.get('/auth/me');
          if (!data.success) {
            logout();
          }
        } catch (error) {
          // Interceptor will handle logout on 401
        }
      }, 15000); // 15 seconds
    }
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, register, verifyOTP, resendOTP, sendMobileOTP, verifyMobileOTP, logout, loading }}>
      {loading ? (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-100/50 text-sm font-medium tracking-widest uppercase">Initializing Secure Session</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
