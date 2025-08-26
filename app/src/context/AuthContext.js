// guarda token/usuário, sincroniza header Authorization e expõe login/register/logout
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userStr = await AsyncStorage.getItem('user');
        if (token) setUserToken(token);
        if (userStr) setUser(JSON.parse(userStr));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = userToken ? `Bearer ${userToken}` : '';
  }, [userToken]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    setUserToken(data.token);
    setUser(data.user);
  };

  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    await login(email, password);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}