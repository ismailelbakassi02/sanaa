import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sanaa_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sanaa_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('sanaa_user', JSON.stringify(res.data.user));
        } catch (error) {
          console.warn('Session expirée ou invalide.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await api.post('/auth/google', { idToken });
      const { token: newToken, user: newUser } = res.data;

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('sanaa_token', newToken);
      localStorage.setItem('sanaa_user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Échec de connexion via Google.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sanaa_token');
    localStorage.removeItem('sanaa_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('sanaa_user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error('Erreur de rafraîchissement du profil:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudentActive: user?.status === 'active' || user?.role === 'admin',
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider.');
  }
  return context;
};
