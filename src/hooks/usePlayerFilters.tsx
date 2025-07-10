import { useState, useMemo } from 'react';

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

export function usePlayerFilters(players: Player[]) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPlayers = useMemo(() => {
    if (selectedFilter === "all") return players;
    if (selectedFilter === "attaquant") return players.filter(player => player.position === "Attaquant");
    if (selectedFilter === "milieu") return players.filter(player => player.position === "Milieu");
    if (selectedFilter === "defenseur") return players.filter(player => player.position === "Défenseur");
    return players;
  }, [players, selectedFilter]);

  return {
    selectedFilter,
    setSelectedFilter,
    filteredPlayers
  };
}