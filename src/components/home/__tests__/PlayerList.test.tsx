import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlayerList } from '../PlayerList';

// Mock hooks
vi.mock('@/hooks/useLikes', () => ({
  useLikes: vi.fn(() => ({
    likes: [],
    like: vi.fn(),
    unlike: vi.fn()
  }))
}));

vi.mock('@/hooks/useVotes', () => ({
  useVotes: vi.fn(() => ({
    votes: [],
    vote: vi.fn()
  }))
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock PlayerCard component
vi.mock('@/components/ui/player-card', () => ({
  PlayerCard: ({ player, onLike, onVote, onViewDetails }: any) => (
    <div data-testid={`player-${player.id}`}>
      <h3>{player.name}</h3>
      <p>{player.position}</p>
      <p>{player.club}</p>
      <button onClick={onLike}>Like</button>
      <button onClick={onVote}>Vote</button>
      <button onClick={onViewDetails}>View Details</button>
      <span data-testid="votes">{player.votes}</span>
    </div>
  )
}));

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
  }
];

describe('PlayerList', () => {
  const mockOnViewDetails = vi.fn();
  const mockOnVote = vi.fn();

  beforeEach(() => {
    mockOnViewDetails.mockClear();
    mockOnVote.mockClear();
  });

  it('renders loading state', () => {
    render(
      <PlayerList
        players={[]}
        loading={true}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toHaveClass('animate-spin');
  });

  it('renders error state', () => {
    render(
      <PlayerList
        players={[]}
        loading={false}
        error="Network error"
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    expect(screen.getByText('Erreur: Network error')).toBeInTheDocument();
  });

  it('renders empty state when no players', () => {
    render(
      <PlayerList
        players={[]}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    expect(screen.getByText('Aucun joueur trouvé pour ce filtre.')).toBeInTheDocument();
  });

  it('renders players list correctly', () => {
    render(
      <PlayerList
        players={mockPlayers}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    expect(screen.getByTestId('player-1')).toBeInTheDocument();
    expect(screen.getByTestId('player-2')).toBeInTheDocument();
    expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
    expect(screen.getByText('Luka Modric')).toBeInTheDocument();
  });

  it('calls onViewDetails when view details button is clicked', () => {
    render(
      <PlayerList
        players={mockPlayers}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    const viewDetailsButtons = screen.getAllByText('View Details');
    fireEvent.click(viewDetailsButtons[0]);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockPlayers[0]);
  });

  it('calls onVote when vote button is clicked', () => {
    render(
      <PlayerList
        players={mockPlayers}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    const voteButtons = screen.getAllByText('Vote');
    fireEvent.click(voteButtons[0]);

    expect(mockOnVote).toHaveBeenCalledWith('1');
  });

  it('displays vote counts correctly', () => {
    render(
      <PlayerList
        players={mockPlayers}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    expect(screen.getByTestId('votes')).toHaveTextContent('100');
  });

  it('handles like functionality through PlayerCard', async () => {
    const { useLikes } = await import('@/hooks/useLikes');
    const mockLike = vi.fn();
    const mockUnlike = vi.fn();

    (useLikes as any).mockReturnValue({
      likes: [],
      like: mockLike,
      unlike: mockUnlike
    });

    render(
      <PlayerList
        players={mockPlayers}
        loading={false}
        onViewDetails={mockOnViewDetails}
        onVote={mockOnVote}
      />
    );

    const likeButtons = screen.getAllByText('Like');
    fireEvent.click(likeButtons[0]);

    await waitFor(() => {
      expect(mockLike).toHaveBeenCalledWith('guest-user');
    });
  });
});