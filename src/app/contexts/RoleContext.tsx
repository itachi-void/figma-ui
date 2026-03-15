import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'manager' | 'user';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('manager'); // Default role

  const userName = role === 'admin' ? 'Admin User' : role === 'manager' ? 'Manager User' : 'Citizen User';

  return (
    <RoleContext.Provider value={{ role, setRole, userName }}>
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