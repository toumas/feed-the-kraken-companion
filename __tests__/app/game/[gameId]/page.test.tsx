import { render, screen } from '@testing-library/react';
import GamePage from '@/app/game/[gameId]/page';
import { getGameSessionWithPlayers } from '@/models/gameSession';

jest.mock('@/models/gameSession', () => ({
  getGameSessionWithPlayers: jest.fn()
}));

describe('GamePage', () => {
  it('renders game not found when session is null', async () => {
    (getGameSessionWithPlayers as jest.Mock).mockResolvedValueOnce(null);

    render(await GamePage({ 
      params: { gameId: 'invalid-game' },
      searchParams: {}
    }));

    expect(screen.getByText('Game not found')).toBeInTheDocument();
  });

  it('renders GameDetails when session exists', async () => {
    const mockSession = {
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

    (getGameSessionWithPlayers as jest.Mock).mockResolvedValueOnce(mockSession);

    render(await GamePage({ 
      params: { gameId: 'game-123' },
      searchParams: { playerId: 'player-456' }
    }));

    expect(screen.getByText('Game Details')).toBeInTheDocument();
    expect(screen.getByText('Game PIN: 1234')).toBeInTheDocument();
    expect(screen.getByText('Host Player')).toBeInTheDocument();
  });
});