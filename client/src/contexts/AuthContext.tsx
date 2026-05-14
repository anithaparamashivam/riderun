import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';

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
    axios
      .get<AuthUser>('/api/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .then(() => setLoading(false), () => setLoading(false));
  }, []);

  function logout() {
    window.location.href = '/api/auth/logout';
  }

  async function updateRole(role: 'passenger' | 'provider') {
    const res = await axios.patch<AuthUser>(
      '/api/users/me/role',
      { role },
      { withCredentials: true }
    );
    setUser(res.data);
  }

  async function login(email: string, password: string): Promise<AuthUser> {
    const res = await axios.post<AuthUser>(
      '/api/auth/login',
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res.data;
  }

  async function register(name: string, email: string, password: string): Promise<AuthUser> {
    const res = await axios.post<AuthUser>(
      '/api/auth/register',
      { name, email, password },
      { withCredentials: true }
    );
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
