import { useState, useEffect } from "react";
import { CountdownModal } from "@/components/ui/countdown-modal";
import { PlayerCard } from "@/components/ui/player-card";
import { PlayerDetailsModal } from "@/components/ui/player-details-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ballonDorIcon from "@/assets/ballon-dor-icon.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePlayers } from "@/hooks/usePlayers";
import { useLikes } from "@/hooks/useLikes";
import { useVotes } from "@/hooks/useVotes";
import { useNotifications } from "@/hooks/useNotifications";

export default function Home() {
  const { user } = useAuth();
  const { players, loading: loadingPlayers } = usePlayers();
  const { notifications, loading: loadingNotifs, markAsRead, markAllAsRead, deleteNotification, generateRandomNotif } = useNotifications('guest-user');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCountdown, setShowCountdown] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtres dynamiques sur les joueurs
  const filteredPlayers = players.filter(player => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "attaquant") return player.position === "Attaquant";
    if (selectedFilter === "milieu") return player.position === "Milieu";
    if (selectedFilter === "defenseur") return player.position === "Défenseur";
    return true;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountdown(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (player: any) => {
    setSelectedPlayer(player);
    setShowPlayerDetails(true);
  };

  const handleVote = async (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    toast({
      title: "Vote enregistré !",
      description: `Vous avez voté pour ${player?.name}. Merci pour votre participation !`,
    });
  };

  const handleLike = (playerId: string) => {
    toast({
      title: "Like ajouté !",
      description: "Votre like a été enregistré.",
    });
  };

  function PlayerCardWithStats({ player, user, toast, handleViewDetails, handleVote }) {
    const { likes, like, unlike } = useLikes(player.id);
    const { votes, vote } = useVotes(player.id);
    const isLiked = !!likes.find(l => l.user_id === 'guest-user');
    const voteCount = votes.reduce((acc, v) => acc + (v.value || 0), 0) + (player.votes || 0);
    const playerWithStats = { ...player, votes: voteCount, isLiked };

    return (
      <PlayerCard
        key={player.id}
        player={playerWithStats}
        onLike={async () => {
          if (isLiked) await unlike('guest-user');
          else await like('guest-user');
        }}
        onVote={() => handleVote(player.id)}
        onViewDetails={() => handleViewDetails(player)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-3 max-w-[320px] mx-auto">
          <div className="flex items-center gap-2">
            <img 
              src={ballonDorIcon} 
              alt="Ballon d'Or" 
              className="w-8 h-8 animate-float"
            />
            <div>
              <h1 className="text-gradient-gold font-bold text-base">Ballon d'Or</h1>
              <p className="text-xs text-muted-foreground">2025</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="relative" onClick={() => setShowNotifModal(true)}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">{unreadCount}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        {/* Section Hero */}
        <div className="text-center space-y-4">
          <Badge 
            className="bg-primary/10 text-primary border-primary/20 animate-pulse cursor-pointer"
            onClick={() => setShowCountdown(true)}
          >
            🏆 Cérémonie dans 298 jours
          </Badge>
          
          <div>
            <h2 className="text-2xl font-bold text-gradient-gold mb-2">
              Votez pour votre favori
            </h2>
            <p className="text-muted-foreground">
              Découvrez les candidats au Ballon d'Or 2025 et participez aux votes de la communauté
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-4">
          <Button
            size="sm"
            className={`btn-golden whitespace-nowrap ${selectedFilter === "all" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedFilter("all")}
          >
            Tous les favoris
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "attaquant" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedFilter("attaquant")}
          >
            Attaquants
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "milieu" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedFilter("milieu")}
          >
            Milieux
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "defenseur" ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedFilter("defenseur")}
          >
            Défenseurs
          </Button>
        </div>

        {/* Liste des joueurs/candidats */}
        <div className="space-y-4">
          {loadingPlayers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun joueur trouvé pour ce filtre.</p>
            </div>
          ) : (
            filteredPlayers.map(player => (
              <PlayerCardWithStats
                key={player.id}
                player={player}
                user={{ id: 'guest-user' }}
                toast={toast}
                handleViewDetails={handleViewDetails}
                handleVote={handleVote}
              />
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-muted to-card p-6 rounded-2xl text-center space-y-4 border border-border/50">
          <h3 className="text-xl font-bold text-gradient-gold">
            Votre vote compte !
          </h3>
          <p className="text-sm text-muted-foreground">
            Rejoignez des milliers de fans et votez pour le prochain Ballon d'Or
          </p>
          <Button className="btn-golden w-full" onClick={() => navigate('/ranking')}>
            Découvrir tous les candidats
          </Button>
        </div>
      </main>

      {/* Modale de compte à rebours */}
      <CountdownModal 
        isOpen={showCountdown} 
        onClose={() => setShowCountdown(false)} 
      />

      {/* Modale de détails du joueur */}
      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={showPlayerDetails}
        onClose={() => setShowPlayerDetails(false)}
        onVote={handleVote}
        onLike={handleLike}
      />

      {/* MODALE NOTIFICATIONS */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-fade-in flex flex-col gap-4 relative">
            <button 
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" 
              onClick={() => setShowNotifModal(false)} 
              aria-label="Fermer"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-center mb-2 text-gradient-gold">Notifications</h2>
            <Button
              className="mb-2 w-full btn-golden"
              onClick={generateRandomNotif}
            >
              Générer une notification
            </Button>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 && (
                <span className="text-muted-foreground text-center">Aucune notification</span>
              )}
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`relative p-3 rounded-lg cursor-pointer transition flex flex-col gap-1 ${
                    n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 border border-primary/30'
                  }`}
                  onClick={() => {
                    if (!n.read) {
                      markAsRead(n.id);
                      if (n.link) {
                        setShowNotifModal(false);
                        navigate(n.link);
                      }
                    }
                  }}
                >
                  <span className="font-semibold flex items-center gap-2">
                    {n.title}
                    {!n.read && <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />}
                  </span>
                  <span className="text-xs">{n.description}</span>
                  <button
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button
                className="mt-2 w-full btn-golden"
                onClick={() => markAllAsRead()}
              >
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}