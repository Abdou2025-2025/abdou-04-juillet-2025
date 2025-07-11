import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePlayers } from "@/hooks/usePlayers";
import { useNotifications } from "@/hooks/useNotifications";
import { usePlayerFilters } from "@/hooks/usePlayerFilters";
import { useErrorHandler } from "@/lib/errors";

import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { PlayerFilters } from "@/components/home/PlayerFilters";
import { PlayerList } from "@/components/home/PlayerList";
import { CallToAction } from "@/components/home/CallToAction";
import { CountdownModal } from "@/components/ui/countdown-modal";
import { PlayerDetailsModal } from "@/components/ui/player-details-modal";
import { NotificationModal } from "@/components/home/NotificationModal";

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  // Hooks pour les données
  const { user } = useAuth();
  const { players, loading: loadingPlayers, error: playersError } = usePlayers();
  const { 
    notifications, 
    loading: loadingNotifs, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    generateRandomNotif 
  } = useNotifications('guest-user');
  
  // State local
  const [showCountdown, setShowCountdown] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  
  // Filtrage des joueurs
  const { selectedFilter, setSelectedFilter, filteredPlayers } = usePlayerFilters(players);
  
  // Calcul des notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Effet pour afficher le countdown après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCountdown(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleViewDetails = (player: any) => {
    try {
      setSelectedPlayer(player);
      setShowPlayerDetails(true);
    } catch (error) {
      handleError(error, 'View player details');
    }
  };

  const handleVote = async (playerId: string) => {
    try {
      const player = players.find(p => p.id === playerId);
      if (!player) {
        throw new Error('Joueur introuvable');
      }
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez voté pour ${player.name}. Merci pour votre participation !`,
      });
    } catch (error) {
      handleError(error, 'Vote for player');
    }
  };

  const handleLike = (playerId: string) => {
    try {
      toast({
        title: "Like ajouté !",
        description: "Votre like a été enregistré.",
      });
    } catch (error) {
      handleError(error, 'Like player');
    }
  };

  const handleExploreAllCandidates = () => {
    try {
      navigate('/ranking');
    } catch (error) {
      handleError(error, 'Navigate to ranking');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* En-tête */}
      <HomeHeader 
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifModal(true)}
      />

      {/* Contenu principal */}
      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in">
        {/* Section Hero */}
        <HeroSection onCountdownClick={() => setShowCountdown(true)} />

        {/* Filtres */}
        <PlayerFilters 
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Liste des joueurs */}
        <PlayerList
          players={filteredPlayers}
          loading={loadingPlayers}
          error={playersError}
          onViewDetails={handleViewDetails}
          onVote={handleVote}
        />

        {/* Call to Action */}
        <CallToAction onExploreClick={handleExploreAllCandidates} />
      </main>

      {/* Modales */}
      <CountdownModal 
        isOpen={showCountdown} 
        onClose={() => setShowCountdown(false)} 
      />

      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={showPlayerDetails}
        onClose={() => setShowPlayerDetails(false)}
        onVote={handleVote}
        onLike={handleLike}
      />

      <NotificationModal
        isOpen={showNotifModal}
        onClose={() => setShowNotifModal(false)}
        notifications={notifications}
        loading={loadingNotifs}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
        onGenerateNotification={generateRandomNotif}
        onNavigate={navigate}
      />
    </div>
  );
}