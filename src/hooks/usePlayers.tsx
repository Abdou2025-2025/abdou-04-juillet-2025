import { useState, useEffect, useCallback } from 'react';

// Données simulées pour les joueurs
const mockPlayers = [
  {
    id: '1',
    name: 'Kylian Mbappé',
    position: 'Attaquant',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    votes: 2847,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Erling Haaland',
    position: 'Attaquant',
    club: 'Manchester City',
    photo: 'https://images.unsplash.com/photo-1556506751-69a7d6fb64dd?w=400&h=400&fit=crop',
    votes: 2634,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Jude Bellingham',
    position: 'Milieu',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop',
    votes: 2456,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pedri González',
    position: 'Milieu',
    club: 'FC Barcelone',
    photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop',
    votes: 2234,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vinicius Jr',
    position: 'Attaquant',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop',
    votes: 2156,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Luka Modrić',
    position: 'Milieu',
    club: 'Real Madrid',
    photo: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    votes: 1987,
    created_at: new Date().toISOString()
  }
];

export function usePlayers() {
  const [players, setPlayers] = useState(mockPlayers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      setPlayers(mockPlayers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, fetchPlayers };
}