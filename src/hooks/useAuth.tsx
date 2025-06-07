
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import useNotification from '@/hooks/useNotification';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  farmSize?: number;
  primaryCrops?: string[];
  experience?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (data: Partial<AuthUser>) => Promise<boolean>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            setUser({
              id: profile.id,
              email: session.user.email || '',
              name: profile.full_name,
              phone: profile.phone,
              location: profile.location,
              farmSize: profile.farm_size_hectares,
              primaryCrops: profile.primary_crops,
              experience: profile.farming_experience_years
            });
          } else {
            // Fallback if profile doesn't exist
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || 'User'
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session?.user?.email);
      // The auth state change listener will handle the user setup
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Login error:', error);
        showError(error.message);
        return false;
      }

      if (data.user) {
        showSuccess('Successfully logged in!');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      showError('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        showError(error.message);
        return false;
      }

      if (data.user) {
        showSuccess('Registration successful! Please check your email to verify your account.');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      showError('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        showError('Logout failed');
      } else {
        showSuccess('Successfully logged out');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      showError('Logout failed');
    }
  };

  const updateProfile = async (data: Partial<AuthUser>): Promise<boolean> => {
    if (!session?.user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          phone: data.phone,
          location: data.location,
          farm_size_hectares: data.farmSize,
          primary_crops: data.primaryCrops,
          farming_experience_years: data.experience
        })
        .eq('id', session.user.id);

      if (error) {
        console.error('Profile update error:', error);
        showError('Failed to update profile');
        return false;
      }

      // Update local user state
      if (user) {
        setUser({ ...user, ...data });
      }
      
      showSuccess('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      showError('Failed to update profile');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!session,
      login,
      register,
      logout,
      isLoading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
