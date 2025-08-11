import React, { createContext, useContext, useState } from 'react';
import { apiClient, LoginRequest, RegisterRequest } from '../api/client';

interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({
  login: async () => {},
  register: async () => {},
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    const payload: LoginRequest = { email, password };
    const response = await apiClient.post('/auth/login', payload);
    setUser(response.data);
  };

  const register = async (name: string, email: string, password: string) => {
    const payload: RegisterRequest = { name, email, password };
    await apiClient.post('/auth/register', payload);
  };

  return (
    <AuthContext.Provider value={{ login, register, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
