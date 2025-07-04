import { useState, useEffect, useCallback } from 'react';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    
    // Simulation de notifications
    const mockNotifications = [
      {
        id: '1',
        user_id: userId,
        title: 'Nouveau vote !',
        description: 'Quelqu\'un a voté pour votre joueur favori',
        read: false,
        created_at: new Date().toISOString(),
        link: '/ranking'
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    return { error: null };
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    return { error: null };
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    return { error: null };
  }, []);

  return { notifications, loading, error, fetchNotifications, markAsRead, markAllAsRead, deleteNotification };
}