import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error getting session:', err);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const signUp = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
      });
      
      if (error) {
        setError(error.message);
        return { data: null, error };
      }
      
    // Simple validation
    if (!email.includes('@')) {
      const error = { message: 'Email invalide' };
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    } finally {
      setLoading(false);
    if (password.length < 6) {
      const error = { message: 'Le mot de passe doit contenir au moins 6 caractères' };
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
    
    // Simulate successful signup
    const mockUser = {
      id: Date.now().toString(),
      email,
      user_metadata: { username: email.split('@')[0] }
    };
    
    setUser(mockUser);
    setLoading(false);
    return { data: { user: mockUser }, error: null };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
      
    // Simple validation
    if (!email.includes('@')) {
      const error = { message: 'Email invalide' };
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    } finally {
      setLoading(false);
    if (password.length < 6) {
      const error = { message: 'Mot de passe incorrect' };
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
    
    // Simulate successful signin
    const mockUser = {
      id: Date.now().toString(),
      email,
      user_metadata: { username: email.split('@')[0] }
    };
    
    setUser(mockUser);
    setLoading(false);
    return { data: { user: mockUser }, error: null };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
      }
      
      return { error };
    } catch (err) {
      setError(err.message);
    setUser(null);
    return { error: null };
  }, []);

  return { user, loading, error, signUp, signIn, signOut };
}