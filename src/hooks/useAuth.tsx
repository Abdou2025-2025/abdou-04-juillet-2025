import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return { data: null, error };
    }
    
    return { data, error: null };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return { data: null, error };
    }
    
    return { data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signOut();
    
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    
    return { error };
  }, []);

  return { user, loading, error, signUp, signIn, signOut };
}