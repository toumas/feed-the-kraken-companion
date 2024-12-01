import { render, screen } from '@testing-library/react';
import GameDetails from '@/components/GameDetails';

const mockGameSession = {
  pin: '1234',
  state: 'LOBBY',
  hostId: 'host-123',
  persistedState: {
    context: {
      players: [
        { id: 'host-123', name: 'Host Player' }
      ]
    }
  }
};

// Only mock CopyPinButton
jest.mock('@/components/CopyPinButton', () => {
  return function MockCopyPinButton() {
    return <div data-testid="copy-pin-button">Copy PIN</div>;
  };
});

describe('GameDetails', () => {
  it('renders game information correctly', () => {
    render(
      <GameDetails
        initialGameSession={mockGameSession as any}
        gameId="game-123"
        playerId="player-456"
      />
    );

    expect(screen.getByText('Game Details')).toBeInTheDocument();
    expect(screen.getByText('Game ID: game-123')).toBeInTheDocument();
    expect(screen.getByText('Game PIN: 1234')).toBeInTheDocument();
    expect(screen.getByText('Game State: LOBBY')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('Host Player')).toBeInTheDocument();
  });

  it('displays correct player count and roles', () => {
    const mockSessionWithPlayers = {
      ...mockGameSession,
      persistedState: {
        context: {
          players: [
            { id: 'host-123', name: 'Host Player' },
            { id: 'player-1', name: 'Player 1' },
            { id: 'player-2', name: 'Player 2' }
          ]
        }
      }
    };

    render(
      <GameDetails
        initialGameSession={mockSessionWithPlayers as any}
        gameId="game-123"
        playerId="player-456"
      />
    );

    expect(screen.getByText('Host Player')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getAllByText('Player').length).toBe(2);
  });

  it('handles null game session', () => {
    render(
      <GameDetails
        initialGameSession={null as any}
        gameId="game-123"
        playerId="player-456"
      />
    );
    
    expect(screen.getByText('Game not found')).toBeInTheDocument();
  });
});