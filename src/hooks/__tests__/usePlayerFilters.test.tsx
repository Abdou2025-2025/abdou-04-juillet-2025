import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePlayerFilters } from '../usePlayerFilters';

const mockPlayers = [
  {
    id: '1',
    name: 'Lionel Messi',
    position: 'Attaquant',
    club: 'Inter Miami',
    photo: 'messi.jpg',
    votes: 100
  },
  {
    id: '2', 
    name: 'Luka Modric',
    position: 'Milieu',
    club: 'Real Madrid',
    photo: 'modric.jpg',
    votes: 80
  },
  {
    id: '3',
    name: 'Virgil van Dijk', 
    position: 'Défenseur',
    club: 'Liverpool',
    photo: 'vandijk.jpg',
    votes: 75
  },
  {
    id: '4',
    name: 'Erling Haaland',
    position: 'Attaquant', 
    club: 'Manchester City',
    photo: 'haaland.jpg',
    votes: 95
  }
];

describe('usePlayerFilters', () => {
  it('initializes with "all" filter selected', () => {
    const { result } = renderHook(() => usePlayerFilters(mockPlayers));
    
    expect(result.current.selectedFilter).toBe('all');
    expect(result.current.filteredPlayers).toEqual(mockPlayers);
  });

  it('filters players by position - Attaquant', () => {
    const { result } = renderHook(() => usePlayerFilters(mockPlayers));
    
    act(() => {
      result.current.setSelectedFilter('attaquant');
    });

    expect(result.current.selectedFilter).toBe('attaquant');
    expect(result.current.filteredPlayers).toHaveLength(2);
    expect(result.current.filteredPlayers.every(p => p.position === 'Attaquant')).toBe(true);
  });

  it('filters players by position - Milieu', () => {
    const { result } = renderHook(() => usePlayerFilters(mockPlayers));
    
    act(() => {
      result.current.setSelectedFilter('milieu');
    });

    expect(result.current.selectedFilter).toBe('milieu');
    expect(result.current.filteredPlayers).toHaveLength(1);
    expect(result.current.filteredPlayers[0].name).toBe('Luka Modric');
  });

  it('filters players by position - Défenseur', () => {
    const { result } = renderHook(() => usePlayerFilters(mockPlayers));
    
    act(() => {
      result.current.setSelectedFilter('defenseur');
    });

    expect(result.current.selectedFilter).toBe('defenseur');
    expect(result.current.filteredPlayers).toHaveLength(1);
    expect(result.current.filteredPlayers[0].name).toBe('Virgil van Dijk');
  });

  it('returns all players when filter is set back to "all"', () => {
    const { result } = renderHook(() => usePlayerFilters(mockPlayers));
    
    // First filter by position
    act(() => {
      result.current.setSelectedFilter('attaquant');
    });
    expect(result.current.filteredPlayers).toHaveLength(2);

    // Then set back to all
    act(() => {
      result.current.setSelectedFilter('all');
    });
    expect(result.current.filteredPlayers).toEqual(mockPlayers);
  });

  it('handles empty players array', () => {
    const { result } = renderHook(() => usePlayerFilters([]));
    
    expect(result.current.filteredPlayers).toEqual([]);
    
    act(() => {
      result.current.setSelectedFilter('attaquant');
    });
    
    expect(result.current.filteredPlayers).toEqual([]);
  });

  it('updates filtered players when input players change', () => {
    const { result, rerender } = renderHook(
      ({ players }) => usePlayerFilters(players),
      { initialProps: { players: mockPlayers.slice(0, 2) } }
    );

    expect(result.current.filteredPlayers).toHaveLength(2);

    // Update players prop
    rerender({ players: mockPlayers });
    expect(result.current.filteredPlayers).toHaveLength(4);
  });
});