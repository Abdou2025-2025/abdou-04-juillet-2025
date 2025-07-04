import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setProfile(data || null);
    setError(error ? error.message : null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId, fetchProfile]);

  const updateProfile = useCallback(async (updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, ...updates })
      .select();
    if (!error && data && data.length > 0) setProfile(data[0]);
    return { data, error };
  }, [userId]);

  return { profile, loading, error, fetchProfile, updateProfile };
} 