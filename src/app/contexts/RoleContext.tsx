import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'driver' | 'citizen';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string;
  profilePictureUrl?: string;
}

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  user: User | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setRoleState(parsedUser.role);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: any) => {
    // This will be called from the UI and will use api.ts
    // For now, we'll let the component handle the actual fetch and call this to set state
    localStorage.setItem('auth_token', credentials.token);
    const userData = {
      id: credentials.id || '1',
      name: credentials.name,
      email: credentials.email || '',
      role: credentials.role
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setRoleState(credentials.role);
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    // Similar to login, state update after successful API call
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setRoleState(null);
    setIsAuthenticated(false);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, user, login, register, logout, isAuthenticated }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
