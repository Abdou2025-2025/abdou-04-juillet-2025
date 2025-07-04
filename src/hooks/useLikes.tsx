import { useState, useEffect, useCallback } from 'react';

export function useLikes(playerId) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLikes = useCallback(async () => {
    setLoading(true);
    // Simulation de likes
    const mockLikes = [
      { id: '1', player_id: playerId, user_id: 'user-123' },
      { id: '2', player_id: playerId, user_id: 'user-456' }
    ];
    setLikes(mockLikes);
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchLikes();
  }, [playerId, fetchLikes]);

  const like = useCallback(async (userId) => {
    const newLike = { id: Date.now().toString(), player_id: playerId, user_id: userId };
    setLikes(prev => [...prev, newLike]);
  }, [playerId]);

  const unlike = useCallback(async (userId) => {
    setLikes(prev => prev.filter(like => like.user_id !== userId));
  }, []);

  return { likes, loading, error, fetchLikes, like, unlike };
}