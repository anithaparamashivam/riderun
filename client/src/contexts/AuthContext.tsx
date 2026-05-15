import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api, { SERVER_URL } from '../lib/api';

interface AuthUser {
  userId: string;
  role: 'passenger' | 'provider' | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
  updateRole: (role: 'passenger' | 'provider') => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
  updateRole: async () => {},
  login: async () => ({ userId: '', role: null }),
  register: async () => ({ userId: '', role: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<AuthUser>('/api/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .then(() => setLoading(false), () => setLoading(false));
  }, []);

  function logout() {
    window.location.href = `${SERVER_URL}/api/auth/logout`;
  }

  async function updateRole(role: 'passenger' | 'provider') {
    const res = await api.patch<AuthUser>('/api/users/me/role', { role });
    setUser(res.data);
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    const res = await api.post<AuthUser>('/api/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  }

  async function register(name: string, email: string, password: string): Promise<AuthUser> {
    const res = await api.post<AuthUser>('/api/auth/register', { name, email, password });
    setUser(res.data);
    return res.data;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateRole, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
