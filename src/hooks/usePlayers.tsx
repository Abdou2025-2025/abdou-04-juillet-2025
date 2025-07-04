import { useState, useEffect, useCallback } from 'react';

// Données simulées pour les joueurs
const mockPlayers = [
  {
    id: '1',
    name: 'Kylian Mbappé',
    position: 'Attaquant',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Erling Haaland',
    position: 'Attaquant',
    club: 'Manchester City',
    photo: 'https://images.unsplash.com/photo-1556506751-69a7d6fb64dd?w=400&h=400&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Jude Bellingham',
    position: 'Milieu',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pedri González',
    position: 'Milieu',
    club: 'FC Barcelone',
    photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
    created_at: new Date().toISOString()
  }
];

export function usePlayers() {
  const [players, setPlayers] = useState(mockPlayers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    // Simulation d'un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 300));
    setPlayers(mockPlayers);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, fetchPlayers };
}