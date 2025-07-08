import { useState, useEffect, useCallback } from 'react';

export function useLikes(playerId) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikes = useCallback(async () => {
    if (!playerId) return;
    
    setLoading(true);
    try {
      // Simulation de likes
      const mockLikes = [
        { id: '1', player_id: playerId, user_id: 'user-123' },
        { id: '2', player_id: playerId, user_id: 'user-456' }
      ];
      setLikes(mockLikes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (playerId) {
      fetchLikes();
    }
  }, [playerId, fetchLikes]);

  const like = useCallback(async (userId) => {
    try {
      const newLike = { id: Date.now().toString(), player_id: playerId, user_id: userId };
      setLikes(prev => [...prev, newLike]);
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, [playerId]);

  const unlike = useCallback(async (userId) => {
    try {
      setLikes(prev => prev.filter(like => like.user_id !== userId));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  return { likes, loading, error, fetchLikes, like, unlike };
}