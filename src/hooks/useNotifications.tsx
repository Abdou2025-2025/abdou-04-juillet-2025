import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setError(error ? error.message : null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const channel = supabase.channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, fetchNotifications)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    return await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  }, []);

  const markAllAsRead = useCallback(async () => {
    return await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
  }, [userId]);

  const deleteNotification = useCallback(async (notificationId) => {
    return await supabase.from('notifications').delete().eq('id', notificationId);
  }, []);

  return { notifications, loading, error, fetchNotifications, markAsRead, markAllAsRead, deleteNotification };
} 