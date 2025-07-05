import { useState, useEffect, useCallback } from 'react';

export interface Profile {
  user_id: string;
  username: string;
  bio: string;
  avatar_url: string;
}

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    
    // Simulation d'un profil
    const mockProfile: Profile = {
      user_id: userId,
      username: 'Utilisateur Test',
      bio: 'Fan de football et du Ballon d\'Or !',
      avatar_url: ''
    };
    
    setProfile(mockProfile);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    const updatedProfile = { ...profile, ...updates } as Profile;
    setProfile(updatedProfile);
    return { data: [updatedProfile], error: null };
  }, [profile]);

  return { profile, loading, error, fetchProfile, updateProfile };
}