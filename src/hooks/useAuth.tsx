import { useState, useEffect, useCallback } from 'react';

// Simulation d'un utilisateur connecté
const mockUser = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'Utilisateur Test',
  stats: {
    posts: 12,
    likes: 45,
    votes: 23
  },
  favorites: ['Mbappé', 'Haaland', 'Bellingham']
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulation d'une vérification d'authentification
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        setUser(mockUser);
      }
      setLoading(false);
    };

    setTimeout(checkAuth, 500); // Simulation d'un délai de chargement
  }, []);

  const signUp = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('isLoggedIn', 'true');
    setUser(mockUser);
    setLoading(false);
    
    return { data: { user: mockUser }, error: null };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulation de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@test.com' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      setUser(mockUser);
      setLoading(false);
      return { data: { user: mockUser }, error: null };
    } else {
      const error = { message: 'Email ou mot de passe incorrect' };
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setLoading(false);
    
    return { error: null };
  }, []);

  return { user, loading, error, signUp, signIn, signOut };
}