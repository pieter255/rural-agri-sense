
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
          // Track login session restoration
          console.log('User session restored for:', parsedUser.email);
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
      // Rate limiting check
      const rateLimitKey = `login_attempts_${email}`;
      const attempts = JSON.parse(localStorage.getItem(rateLimitKey) || '{"count": 0, "timestamp": 0}');
      const now = Date.now();
      
      if (now - attempts.timestamp < 300000 && attempts.count >= 5) { // 5 minutes lockout
        throw new Error('Too many login attempts. Please try again later.');
      }
      
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
      
      // Track successful login
      localStorage.removeItem(rateLimitKey);
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('agroSenseUser', JSON.stringify(mockUser));
      
      // Set last login timestamp
      localStorage.setItem('lastLogin', new Date().toISOString());
      
      return true;
    } catch (error) {
      // Track failed login attempt
      const rateLimitKey = `login_attempts_${email}`;
      const attempts = JSON.parse(localStorage.getItem(rateLimitKey) || '{"count": 0, "timestamp": 0}');
      attempts.count = (attempts.count || 0) + 1;
      attempts.timestamp = Date.now();
      localStorage.setItem(rateLimitKey, JSON.stringify(attempts));
      
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
      
      // Enhanced validation with security checks
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      // Strong password validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('Password must contain uppercase, lowercase, and numbers');
      }
      
      if (name.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      
      // Check if email already exists (simulate)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        throw new Error('An account with this email already exists');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name
      };
      
      // Store user in registered users list
      existingUsers.push(mockUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      setUser(mockUser);
      localStorage.setItem('agroSenseUser', JSON.stringify(mockUser));
      localStorage.setItem('registrationDate', new Date().toISOString());
      
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
    localStorage.removeItem('lastLogin');
    
    // Clear sensitive data on logout
    sessionStorage.clear();
    
    console.log('User logged out successfully');
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
