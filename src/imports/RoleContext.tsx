import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'manager' | 'driver' | 'citizen';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  user?: any;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin'); // Default role

  const userName = 
    role === 'admin' ? 'Admin User' : 
    role === 'manager' ? 'Manager User' : 
    role === 'driver' ? 'Driver User' : 'Citizen User';
    
  // Adding mock user object for compatibility with components expecting `user.role`
  const user = {
    id: `U-${role.toUpperCase()}-1`,
    name: userName,
    role: role,
  };

  return (
    <RoleContext.Provider value={{ role, setRole, userName, user }}>
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