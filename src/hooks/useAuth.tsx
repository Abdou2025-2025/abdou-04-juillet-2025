import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError, ValidationError, withErrorHandling } from '@/lib/errors';

export interface User {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  clearError: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validation helpers
  const validateEmail = (email: string): void => {
    if (!email.includes('@')) {
      throw new ValidationError('Email invalide', 'L\'email doit contenir un symbole @');
    }
  };

  const validatePassword = (password: string): void => {
    if (password.length < 6) {
      throw new ValidationError(
        'Le mot de passe doit contenir au moins 6 caractères',
        'Veuillez choisir un mot de passe plus sécurisé'
      );
    }
  };

  // Simulate loading with timeout
  const simulateLoading = (duration = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, duration));
  };

  // Create mock user
  const createMockUser = (email: string): User => ({
    id: Date.now().toString(),
    email,
    user_metadata: { username: email.split('@')[0] }
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const { error } = await withErrorHandling(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user as User ?? null);
      }, 'Auth initialization', false);

      if (error) {
        setError(error.message);
      }

      // Simulate loading delay
      setTimeout(() => setLoading(false), 500);
    };

    initializeAuth();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    const result = await withErrorHandling(async () => {
      // Validate inputs
      validateEmail(email);
      validatePassword(password);
      
      // Simulate API call
      await simulateLoading(1000);
      
      // For now, create mock user (TODO: replace with real Supabase call)
      const mockUser = createMockUser(email);
      setUser(mockUser);
      
      return { user: mockUser };
    }, 'Sign up', false);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return { data: null, error: result.error };
    }

    return { data: result.data, error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    const result = await withErrorHandling(async () => {
      // Validate inputs
      validateEmail(email);
      validatePassword(password);
      
      // Try real Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw new AuthError('Identifiants incorrects', 'Vérifiez votre email et mot de passe');
      }
      
      if (data.user) {
        setUser(data.user as User);
        return { user: data.user };
      }
      
      // Fallback to mock for development
      await simulateLoading(1000);
      const mockUser = createMockUser(email);
      setUser(mockUser);
      
      return { user: mockUser };
    }, 'Sign in', false);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return { data: null, error: result.error };
    }

    return { data: result.data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await withErrorHandling(async () => {
      // Try real Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new AuthError('Erreur lors de la déconnexion');
      }
      
      // Simulate delay
      await simulateLoading(500);
      setUser(null);
      
      return {};
    }, 'Sign out', false);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return { error: result.error };
    }

    return { error: null };
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError
  };
}