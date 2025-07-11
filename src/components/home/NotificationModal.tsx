import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  link?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onGenerateNotification: () => void;
  onNavigate: (path: string) => void;
}

export function NotificationModal({
  isOpen,
  onClose,
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onGenerateNotification,
  onNavigate
}: NotificationModalProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
      if (notification.link) {
        onClose();
        onNavigate(notification.link);
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteNotification(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-fade-in flex flex-col gap-4 relative">
        <button 
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" 
          onClick={onClose} 
          aria-label="Fermer"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold text-center mb-2 text-gradient-gold">
          Notifications
        </h2>
        
        <Button
          className="mb-2 w-full btn-golden"
          onClick={onGenerateNotification}
          disabled={loading}
        >
          {loading ? 'Génération...' : 'Générer une notification'}
        </Button>
        
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <span className="text-muted-foreground text-center">
              Aucune notification
            </span>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`relative p-3 rounded-lg cursor-pointer transition flex flex-col gap-1 ${
                  notification.read 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary/10 border border-primary/30'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <span className="font-semibold flex items-center gap-2">
                  {notification.title}
                  {!notification.read && (
                    <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />
                  )}
                </span>
                <span className="text-xs">{notification.description}</span>
                <button
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs"
                  onClick={(e) => handleDeleteClick(e, notification.id)}
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            className="mt-2 w-full btn-golden"
            onClick={onMarkAllAsRead}
            disabled={loading}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>
    </div>
  );
}