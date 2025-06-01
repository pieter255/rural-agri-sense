
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data on app load
    try {
      const savedUser = localStorage.getItem('agroSenseUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Validate user object structure
        if (parsedUser.id && parsedUser.email && parsedUser.name) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('agroSenseUser');
        }
      }
    } catch (error) {
      console.error('Error parsing saved user data:', error);
      localStorage.removeItem('agroSenseUser');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with better validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('agroSenseUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Enhanced validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (name.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name
      };
      
      setUser(mockUser);
      localStorage.setItem('agroSenseUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agroSenseUser');
    // Clear other user-specific data
    localStorage.removeItem('userPreferences');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
