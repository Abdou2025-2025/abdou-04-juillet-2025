import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, TrendingUp, Users, Newspaper } from "lucide-react";

// Données de test pour le classement
const rankingData = [
  {
    id: "1",
    rank: 1,
    name: "Kylian Mbappé",
    club: "Real Madrid",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    points: 2847,
    percentage: 23.5,
    trend: "+2",
    votes: {
      community: 2847,
      media: 2634,
      bookmakers: 2923
    }
  },
  {
    id: "2",
    rank: 2,
    name: "Erling Haaland",
    club: "Manchester City",
    photo: "https://images.unsplash.com/photo-1556506751-69a7d6fb64dd?w=100&h=100&fit=crop",
    points: 2634,
    percentage: 21.8,
    trend: "-1",
    votes: {
      community: 2634,
      media: 2847,
      bookmakers: 2756
    }
  },
  {
    id: "3",
    rank: 3,
    name: "Jude Bellingham",
    club: "Real Madrid",
    photo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=100&h=100&fit=crop",
    points: 2456,
    percentage: 20.3,
    trend: "+1",
    votes: {
      community: 2456,
      media: 2398,
      bookmakers: 2587
    }
  },
  {
    id: "4",
    rank: 4,
    name: "Pedri González",
    club: "FC Barcelone",
    photo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
    points: 2234,
    percentage: 18.4,
    trend: "=",
    votes: {
      community: 2234,
      media: 2156,
      bookmakers: 2298
    }
  }
];

const extendedRanking = [
  ...rankingData,
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `${i + 5}`,
    rank: i + 5,
    name: `Joueur ${i + 5}`,
    club: "Club Exemple",
    photo: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100&h=100&fit=crop",
    points: Math.floor(Math.random() * 2000) + 500,
    percentage: Math.floor(Math.random() * 15) + 5,
    trend: Math.random() > 0.5 ? "+1" : Math.random() > 0.5 ? "-1" : "=",
    votes: {
      community: Math.floor(Math.random() * 2000) + 500,
      media: Math.floor(Math.random() * 2000) + 500,
      bookmakers: Math.floor(Math.random() * 2000) + 500
    }
  }))
];

export default function Ranking() {
  const [activeTab, setActiveTab] = useState("community");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.includes("+")) return "text-green-500";
    if (trend.includes("-")) return "text-red-500";
    return "text-muted-foreground";
  };

  const getCurrentRanking = () => {
    switch (activeTab) {
      case "media":
        return extendedRanking.sort((a, b) => b.votes.media - a.votes.media);
      case "bookmakers":
        return extendedRanking.sort((a, b) => b.votes.bookmakers - a.votes.bookmakers);
      default:
        return extendedRanking.sort((a, b) => b.votes.community - a.votes.community);
    }
  };

  const currentRanking = getCurrentRanking();

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
        <div className="p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary animate-glow" />
            <h1 className="text-2xl font-bold text-gradient-gold">Classement</h1>
          </div>
          
          {/* Tabs pour les différents types de votes */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="community" className="flex items-center gap-2 text-xs">
                <Users className="w-4 h-4" />
                Communauté
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 text-xs">
                <Newspaper className="w-4 h-4" />
                Médias
              </TabsTrigger>
              <TabsTrigger value="bookmakers" className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4" />
                Bookmakers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 animate-fade-in pb-20">
        {/* Top 3 mis en avant */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gradient-gold">
            🏆 Top 3 Favoris
          </h2>
          {/* Ligne horizontale pour le top 3 */}
          <div className="flex flex-row gap-2 justify-between md:gap-4">
            {currentRanking.slice(0, 3).map((player, index) => (
              <div key={player.id} className={`flex-1 flex flex-col items-center bg-card rounded-xl p-2 card-golden ${index === 0 ? 'ring-2 ring-primary/50' : ''} animate-slide-up`} style={{ animationDelay: `${index * 100}ms` }}>
                {/* Icône rang */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-1">
                  {getRankIcon(player.rank)}
                </div>
                {/* Avatar */}
                <Avatar className="w-12 h-12 ring-2 ring-primary/20 mb-1">
                  <AvatarImage src={player.photo} alt={player.name} />
                  <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {/* Nom et club */}
                <h3 className="font-bold text-gradient-gold text-center truncate w-full text-sm">
                  {player.name}
                </h3>
                <p className="text-xs text-muted-foreground text-center truncate w-full mb-1">
                  {player.club}
                </p>
                {/* Pourcentage et trend */}
                <div className="flex items-center gap-1 justify-center mb-1">
                  <span className="font-bold text-primary text-sm">
                    {player.percentage}%
                  </span>
                  <span className={`text-xs ${getTrendColor(player.trend)}`}>{player.trend}</span>
                </div>
                {/* Votes */}
                <div className="text-xs text-muted-foreground text-center">
                  {player.points.toLocaleString()} votes
                </div>
                {/* Barre de progression */}
                <div className="w-full mt-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                      style={{ width: `${player.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classement complet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Classement complet</h3>
            <Badge variant="outline" className="text-xs">
              {currentRanking.length} candidats
            </Badge>
          </div>
          
          <div className="space-y-2">
            {currentRanking.slice(3).map((player, index) => (
              <Card 
                key={player.id} 
                className="card-golden hover:scale-[1.01] transition-all duration-200"
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center">
                      <span className="text-sm font-bold text-muted-foreground">
                        #{player.rank}
                      </span>
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.photo} alt={player.name} />
                      <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{player.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {player.club}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {player.percentage}%
                        </span>
                        <span className={`text-xs ${getTrendColor(player.trend)}`}>
                          {player.trend}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.points.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <Card className="card-golden">
          <CardContent className="p-4 text-center space-y-2">
            <h3 className="font-bold text-gradient-gold">Statistiques des votes</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-lg">47.2K</div>
                <div className="text-muted-foreground">Total votes</div>
              </div>
              <div>
                <div className="font-bold text-lg">156</div>
                <div className="text-muted-foreground">Pays</div>
              </div>
              <div>
                <div className="font-bold text-lg">298</div>
                <div className="text-muted-foreground">Jours restants</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}