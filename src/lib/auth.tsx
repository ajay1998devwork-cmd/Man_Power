import { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient } from './api-client';
import { SuperAdminUser } from './types';

interface AuthContextType {
  user: SuperAdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const isLoading = false;

  const login = async (email: string, password: string) => {
    const userData = await apiClient.post<SuperAdminUser>('/auth/login', {
      email,
      password,
    });
    setUser(userData);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
  };

  const refetch = async () => {
    // Authentication is intentionally disabled while all routes are public.
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
