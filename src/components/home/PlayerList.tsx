import { PlayerCard } from "@/components/ui/player-card";
import { useLikes } from "@/hooks/useLikes";
import { useVotes } from "@/hooks/useVotes";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  name: string;
  position: string;
  club: string;
  photo: string;
  votes?: number;
  isLiked?: boolean;
  [key: string]: any;
}

interface PlayerListProps {
  players: Player[];
  loading: boolean;
  error?: string | null;
  onViewDetails: (player: Player) => void;
  onVote: (playerId: string) => void;
}

interface PlayerCardWithStatsProps {
  player: Player;
  onViewDetails: (player: Player) => void;
  onVote: (playerId: string) => void;
}

function PlayerCardWithStats({ player, onViewDetails, onVote }: PlayerCardWithStatsProps) {
  const { likes, like, unlike } = useLikes(player.id);
  const { votes, vote } = useVotes(player.id);
  const { toast } = useToast();
  
  const isLiked = !!likes.find(l => l.user_id === 'guest-user');
  const voteCount = votes.reduce((acc, v) => acc + (v.value || 0), 0) + (player.votes || 0);
  const playerWithStats = { ...player, votes: voteCount, isLiked };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlike('guest-user');
      } else {
        await like('guest-user');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le like",
        variant: "destructive"
      });
    }
  };

  return (
    <PlayerCard
      key={player.id}
      player={playerWithStats}
      onLike={handleLike}
      onVote={() => onVote(player.id)}
      onViewDetails={() => onViewDetails(player)}
    />
  );
}

export function PlayerList({ 
  players, 
  loading, 
  error, 
  onViewDetails, 
  onVote 
}: PlayerListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Erreur: {error}</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun joueur trouvé pour ce filtre.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map(player => (
        <PlayerCardWithStats
          key={player.id}
          player={player}
          onViewDetails={onViewDetails}
          onVote={onVote}
        />
      ))}
    </div>
  );
}