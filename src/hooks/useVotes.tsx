import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useVotes(playerId) {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('player_id', playerId);
    setVotes(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchVotes();
    const channel = supabase.channel('public:votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `player_id=eq.${playerId}` }, fetchVotes)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [playerId, fetchVotes]);

  const vote = useCallback(async (userId, value) => {
    return await supabase.from('votes').upsert([{ player_id: playerId, user_id: userId, value }]);
  }, [playerId]);

  return { votes, loading, error, fetchVotes, vote };
} 