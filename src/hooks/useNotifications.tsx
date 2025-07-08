import { useState, useEffect, useCallback } from 'react';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
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
        },
        {
          id: '2',
          user_id: userId,
          title: 'Nouveau commentaire',
          description: 'Votre post a reçu un nouveau commentaire',
          read: false,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          link: '/club'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, []);

  const generateRandomNotif = useCallback(() => {
    const titles = [
      'Nouveau vote !',
      'Nouveau commentaire',
      'Nouveau like',
      'Mise à jour du classement',
      'Nouveau message'
    ];
    const descriptions = [
      'Quelqu\'un a voté pour votre joueur favori',
      'Votre post a reçu un nouveau commentaire',
      'Votre commentaire a été liké',
      'Le classement a été mis à jour',
      'Vous avez reçu un nouveau message'
    ];
    
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const newNotif = {
      id: Date.now().toString(),
      user_id: userId,
      title: randomTitle,
      description: randomDesc,
      read: false,
      created_at: new Date().toISOString(),
      link: '/ranking'
    };
    
    setNotifications(prev => [newNotif, ...prev]);
  }, [userId]);

  return { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    generateRandomNotif
  };
}