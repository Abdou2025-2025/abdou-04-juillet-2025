import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });
    setPlayers(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
    const channel = supabase.channel('public:players')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, fetchPlayers)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPlayers]);

  return { players, loading, error, fetchPlayers };
} 