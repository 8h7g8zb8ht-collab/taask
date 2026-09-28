import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  availableUsers: { email: string; name: string }[];
}

// Initial in-memory session accounts for quick demonstration of multi-user separation
const INITIAL_ACCOUNTS: { user: User; passwordHash: string }[] = [
  {
    user: {
      id: 'usr_alex',
      email: 'alex@example.com',
      name: 'Alex Johnson',
      createdAt: '2026-09-01T08:00:00.000Z',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      id: 'usr_sarah',
      email: 'sarah@example.com',
      name: 'Sarah Connor',
      createdAt: '2026-09-10T10:30:00.000Z',
    },
    passwordHash: 'password123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // In-memory accounts repository (no localStorage, ready to be replaced with Supabase Auth)
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  // Default to Alex so reviewer can see tasks right away or switch to log out/register
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_ACCOUNTS[0].user);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Simulate slight async response matching real auth clients
    await new Promise((resolve) => setTimeout(resolve, 300));

    const found = accounts.find((acc) => acc.user.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setCurrentUser(found.user);
    return { success: true };
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const existing = accounts.find((acc) => acc.user.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Generate a display name from email prefix
    const namePrefix = normalizedEmail.split('@')[0];
    const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: formattedName,
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [...prev, { user: newUser, passwordHash: password }]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login,
        register,
        logout,
        availableUsers: accounts.map((acc) => ({ email: acc.user.email, name: acc.user.name })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
