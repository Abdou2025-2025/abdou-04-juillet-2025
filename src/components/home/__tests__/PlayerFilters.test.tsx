import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlayerFilters } from '../PlayerFilters';

describe('PlayerFilters', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all filter buttons', () => {
    render(
      <PlayerFilters 
        selectedFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    expect(screen.getByText('Tous les favoris')).toBeInTheDocument();
    expect(screen.getByText('Attaquants')).toBeInTheDocument();
    expect(screen.getByText('Milieux')).toBeInTheDocument();
    expect(screen.getByText('Défenseurs')).toBeInTheDocument();
  });

  it('highlights the selected filter', () => {
    render(
      <PlayerFilters 
        selectedFilter="attaquant" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const attaquantButton = screen.getByText('Attaquants');
    expect(attaquantButton).toHaveClass('ring-2', 'ring-primary');
  });

  it('calls onFilterChange when a filter is clicked', () => {
    render(
      <PlayerFilters 
        selectedFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const milieuButton = screen.getByText('Milieux');
    fireEvent.click(milieuButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('milieu');
  });

  it('applies golden styling to the main filter', () => {
    render(
      <PlayerFilters 
        selectedFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const mainButton = screen.getByText('Tous les favoris');
    expect(mainButton).toHaveClass('btn-golden');
  });

  it('applies outline variant to secondary filters', () => {
    render(
      <PlayerFilters 
        selectedFilter="all" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const attaquantButton = screen.getByText('Attaquants');
    // Test that it's not the primary golden button
    expect(attaquantButton).not.toHaveClass('btn-golden');
  });
});