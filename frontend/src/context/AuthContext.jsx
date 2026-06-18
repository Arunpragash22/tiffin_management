import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';
import { ROLES } from '../utils/constants';
import { authStorage } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (!token || !storedUser) {
      authStorage.clear();
      setUser(null);
    } else {
      setUser(storedUser);
    }

    setInitializing(false);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(credentials);
      authStorage.setToken(data.token);
      const userData = {
        userId: data.userId,
        email: data.email,
        role: data.role,
        studentId: data.studentId,
        fullName: data.fullName,
      };
      authStorage.setUser(userData);
      setUser(userData);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore logout errors
    }
    authStorage.clear();
    setUser(null);
  }, []);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isStudent = user?.role === ROLES.STUDENT;
  const isAuthenticated = !!user && !!authStorage.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading: initializing || loading,
        isAdmin,
        isStudent,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
