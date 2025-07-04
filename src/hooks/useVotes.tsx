import { useState, useEffect, useCallback } from 'react';

export function useVotes(playerId) {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVotes = useCallback(async () => {
    setLoading(true);
    // Simulation de votes
    const mockVotes = [
      { id: '1', player_id: playerId, user_id: 'user-123', value: 1 },
      { id: '2', player_id: playerId, user_id: 'user-456', value: 1 }
    ];
    setVotes(mockVotes);
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchVotes();
  }, [playerId, fetchVotes]);

  const vote = useCallback(async (userId, value) => {
    const newVote = { id: Date.now().toString(), player_id: playerId, user_id: userId, value };
    setVotes(prev => [...prev, newVote]);
  }, [playerId]);

  return { votes, loading, error, fetchVotes, vote };
}