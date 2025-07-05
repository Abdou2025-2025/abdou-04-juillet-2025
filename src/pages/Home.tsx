import { useState, useEffect } from "react";
import { CountdownModal } from "@/components/ui/countdown-modal";
import { PlayerCard } from "@/components/ui/player-card";
import { PlayerDetailsModal } from "@/components/ui/player-details-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ballonDorIcon from "@/assets/ballon-dor-icon.png";
import mbappePhoto from "@/assets/player-mbappe.jpg";
import haalandPhoto from "@/assets/player-haaland.jpg";
import bellinghamPhoto from "@/assets/player-bellingham.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePlayers } from "@/hooks/usePlayers";
import { useLikes } from "@/hooks/useLikes";
import { useVotes } from "@/hooks/useVotes";
import { useNotifications } from "@/hooks/useNotifications";

interface PlayerWithStats {
  id: string;
  name: string;
  position: string;
  club: string;
  photo: string;
  created_at: string;
  votes?: number;
  isLiked?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const { players, loading: loadingPlayers } = usePlayers();
  const { notifications, loading: loadingNotifs, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState<boolean>(false);
  const [showNotifModal, setShowNotifModal] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

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
    if (!user) return toast({ title: "Connectez-vous pour voter" });
    const player = players.find(p => p.id === playerId);
    toast({
      title: "Vote enregistré !",
      description: `Vous avez voté pour ${player?.name}. Merci pour votre participation !`,
    });
  };

  const handleLike = (playerId: string) => {
    // Implementation of handleLike function
  };

  function PlayerCardWithStats({ player, user, toast, handleViewDetails, handleVote }) {
    const { likes, like, unlike } = useLikes(player.id);
    const { votes, vote } = useVotes(player.id);
    const isLiked = !!likes.find(l => l.user_id === user?.id);
    const voteCount = votes.reduce((acc, v) => acc + (v.value || 0), 0);
    const playerWithStats = { ...player, votes: voteCount, isLiked };

    return (
      <PlayerCard
        key={player.id}
        player={playerWithStats}
        onLike={async () => {
          if (!user) return toast({ title: "Connectez-vous pour liker" });
          if (isLiked) await unlike(user.id);
          else await like(user.id);
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
            className="bg-primary/10 text-primary border-primary/20 animate-pulse"
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
            className={`btn-golden whitespace-nowrap ${selectedFilter === "all" ? "border-2 border-yellow-400" : ""}`}
            onClick={() => setSelectedFilter("all")}
          >
            Tous les favoris
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "attaquant" ? "border-2 border-yellow-400 !border-yellow-400" : ""}`}
            onClick={() => setSelectedFilter("attaquant")}
          >
            Attaquants
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "milieu" ? "border-2 border-yellow-400 !border-yellow-400" : ""}`}
            onClick={() => setSelectedFilter("milieu")}
          >
            Milieux
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`whitespace-nowrap ${selectedFilter === "defenseur" ? "border-2 border-yellow-400 !border-yellow-400" : ""}`}
            onClick={() => setSelectedFilter("defenseur")}
          >
            Défenseurs
          </Button>
        </div>

        {/* Liste des joueurs/candidats */}
        <div className="space-y-4">
          {loadingPlayers ? (
            <div>Chargement...</div>
          ) : filteredPlayers.length === 0 ? (
            <div>Aucun joueur trouvé.</div>
          ) : (
            filteredPlayers.map(player => (
              <PlayerCardWithStats
                key={player.id}
                player={player}
                user={user}
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
          <Button className="btn-golden w-full">
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
          <div className="bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-xs animate-fade-in flex flex-col gap-4 relative text-white">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setShowNotifModal(false)} aria-label="Fermer">✕</button>
            <h2 className="text-xl font-bold text-center mb-2">Notifications</h2>
            <button
              className="mb-2 w-full py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
              onClick={() => {
                // Implementation of generateRandomNotif function
              }}
            >
              Générer une notification
            </button>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 && <span className="text-zinc-400 text-center">Aucune notification</span>}
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`relative p-3 rounded-lg cursor-pointer transition flex flex-col gap-1 ${n.read ? 'bg-zinc-800 text-zinc-400' : 'bg-yellow-900/30 border border-yellow-500/30'}`}
                  onClick={e => {
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
                    {!n.read && <span className="ml-2 inline-block w-2 h-2 bg-yellow-400 rounded-full" />}
                  </span>
                  <span className="text-xs">{n.description}</span>
                  <button
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-400 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    aria-label="Supprimer"
                  >✕</button>
                </div>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                className="mt-2 w-full py-2 rounded-lg bg-yellow-500 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => markAllAsRead()}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}