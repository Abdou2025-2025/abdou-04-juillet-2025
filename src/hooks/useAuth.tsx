import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const signUp = useCallback(async (email: string, password: string) => {
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
      return { data: null, error: error.message };
    }
    
    return { data: data.user, error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return { data: null, error: error.message };
    }
    
    return { data: data.user, error: null };
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signOut();
    
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    
    return { error: error?.message || null };
  }, []);

  return { user, loading, error, signUp, signIn, signOut };
}