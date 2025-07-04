import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useLikes(playerId) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLikes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('player_id', playerId);
    setLikes(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchLikes();
    const channel = supabase.channel('public:likes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `player_id=eq.${playerId}` }, fetchLikes)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [playerId, fetchLikes]);

  const like = useCallback(async (userId) => {
    const { error } = await supabase.from('likes').insert([{ player_id: playerId, user_id: userId }]);
    if (error && (error.code === '23505' || error.code === '409')) {
      // Ignore le conflit (déjà liké)
      return;
    }
    if (error) throw error;
  }, [playerId]);

  const unlike = useCallback(async (userId) => {
    return await supabase.from('likes').delete().eq('player_id', playerId).eq('user_id', userId);
  }, [playerId]);

  return { likes, loading, error, fetchLikes, like, unlike };
} 