import { useState, useEffect, useCallback } from 'react';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Simulation d'un profil
      const mockProfile = {
        user_id: userId,
        username: 'Utilisateur Test',
        bio: 'Fan de football et du Ballon d\'Or !',
        avatar_url: ''
      };
      
      setProfile(mockProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  const updateProfile = useCallback(async (updates: any) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      return { data: [updatedProfile], error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }, [profile]);

  return { profile, loading, error, fetchProfile, updateProfile };
}