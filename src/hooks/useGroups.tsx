import { useState, useEffect, useCallback } from 'react';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    // Simulation de groupes
    const mockGroups = [];
    setGroups(mockGroups);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(async (payload) => {
    const newGroup = { id: Date.now().toString(), ...payload };
    setGroups(prev => [newGroup, ...prev]);
    return { data: newGroup, error: null };
  }, []);

  const joinGroup = useCallback(async (groupId, userId) => {
    return { error: null };
  }, []);

  const leaveGroup = useCallback(async (groupId, userId) => {
    return { error: null };
  }, []);

  return { groups, loading, error, fetchGroups, createGroup, joinGroup, leaveGroup };
}