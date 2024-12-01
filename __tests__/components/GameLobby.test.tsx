import { render, screen } from '@testing-library/react';
import GameLobby from '@/components/GameLobby';

const mockGameSession = {
  hostId: 'host-123',
  persistedState: {
    context: {
      players: [
        { id: 'host-123', name: 'Host Player' },
        { id: 'player-456', name: 'Regular Player' }
      ]
    }
  }
};

describe('GameLobby', () => {
  it('renders player list correctly', () => {
    render(
      <GameLobby 
        gameSession={mockGameSession as any}
        gameId="game-123"
        playerId="player-456"
      />
    );

    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('Host Player')).toBeInTheDocument();
    expect(screen.getByText('Regular Player')).toBeInTheDocument();
    expect(screen.getByText('Host')).toBeInTheDocument();
    expect(screen.getByText('Player')).toBeInTheDocument();
  });

  it('correctly identifies host player', () => {
    render(
      <GameLobby 
        gameSession={mockGameSession as any}
        gameId="game-123"
        playerId="player-456"
      />
    );

    const hostCell = screen.getAllByText('Host')[0];
    const playerCell = screen.getByText('Player');
    
    expect(hostCell).toBeInTheDocument();
    expect(playerCell).toBeInTheDocument();
  });

  it('handles empty player list', () => {
    const emptyGameSession = {
      ...mockGameSession,
      persistedState: {
        context: {
          players: []
        }
      }
    };

    render(
      <GameLobby 
        gameSession={emptyGameSession as any}
        gameId="game-123"
        playerId="player-456"
      />
    );

    const rows = screen.queryAllByRole('row');
    // Only header row should be present
    expect(rows.length).toBe(1);
    expect(rows[0]).toHaveTextContent('Name');
    expect(rows[0]).toHaveTextContent('Role');
  });
});