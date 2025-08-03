import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { authAPI } from '@/services/authAPI';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session and validate token
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedUser = await authAPI.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid session
      authAPI.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      // Store tokens securely
      localStorage.setItem('edike_user', JSON.stringify(response.user));
      localStorage.setItem('edike_access_token', response.access_token);
      localStorage.setItem('edike_refresh_token', response.refresh_token);
      
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw to handle in UI
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await authAPI.changePassword({
      current_password: currentPassword,
      new_password: newPassword
    });
  };

  const resetPassword = async (email: string) => {
    await authAPI.resetPassword({ email });
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updatedUser = await authAPI.updateProfile(updates);
    setUser(updatedUser);
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      localStorage.setItem('edike_access_token', response.access_token);
      localStorage.setItem('edike_refresh_token', response.refresh_token);
      setUser(response.user);
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      refreshToken().catch(() => {
        // Token refresh failed, user will be logged out
      });
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    changePassword,
    resetPassword,
    updateProfile,
    refreshToken,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};