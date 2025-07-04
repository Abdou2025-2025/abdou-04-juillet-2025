import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
    setGroups(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGroups();
    const channel = supabase.channel('public:groups')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, fetchGroups)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchGroups]);

  const createGroup = useCallback(async (payload) => {
    return await supabase.from('groups').insert([payload]);
  }, []);

  const joinGroup = useCallback(async (groupId, userId) => {
    return await supabase.from('group_members').insert([{ group_id: groupId, user_id: userId }]);
  }, []);

  const leaveGroup = useCallback(async (groupId, userId) => {
    return await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
  }, []);

  return { groups, loading, error, fetchGroups, createGroup, joinGroup, leaveGroup };
} 