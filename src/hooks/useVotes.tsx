import { useState, useEffect, useCallback } from 'react';

export function useVotes(playerId) {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVotes = useCallback(async () => {
    if (!playerId) return;
    
    setLoading(true);
    try {
      // Simulation de votes
      const mockVotes = [
        { id: '1', player_id: playerId, user_id: 'user-123', value: 1 },
        { id: '2', player_id: playerId, user_id: 'user-456', value: 1 }
      ];
      setVotes(mockVotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (playerId) {
      fetchVotes();
    }
  }, [playerId, fetchVotes]);

  const vote = useCallback(async (userId, value) => {
    try {
      const newVote = { id: Date.now().toString(), player_id: playerId, user_id: userId, value };
      setVotes(prev => [...prev, newVote]);
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, [playerId]);

  return { votes, loading, error, fetchVotes, vote };
}