import { useState, useEffect, useCallback } from 'react';

export interface Vote {
  id: string;
  player_id: string;
  user_id: string;
  value: number;
}

export function useVotes(playerId: string | null) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = useCallback(async () => {
    if (!playerId) return;
    setLoading(true);
    
    try {
      // Simulation de votes
      const mockVotes: Vote[] = [
        { id: '1', player_id: playerId, user_id: 'user-123', value: 1 },
        { id: '2', player_id: playerId, user_id: 'user-456', value: 1 }
      ];
      setVotes(mockVotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchVotes();
  }, [playerId, fetchVotes]);

  const vote = useCallback(async (userId: string, value: number) => {
    if (!playerId) return { data: null, error: 'Player ID manquant' };
    
    try {
      const newVote: Vote = { 
        id: Date.now().toString(), 
        player_id: playerId, 
        user_id: userId, 
        value 
      };
      setVotes(prev => [...prev, newVote]);
      return { data: newVote, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, [playerId]);

  return { votes, loading, error, fetchVotes, vote };
}