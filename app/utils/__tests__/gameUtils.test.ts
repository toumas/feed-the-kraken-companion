
import { joinGame, findGameByPin } from '../gameUtils';
import { generateUUID } from '@/lib/utils';

jest.mock('@/lib/utils', () => ({
  generateUUID: jest.fn(),
}));

global.fetch = jest.fn();

describe('gameUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateUUID as jest.Mock).mockReturnValue('test-player-id');
  });

  describe('findGameByPin', () => {
    it('returns game when found', async () => {
      const mockGame = { id: 'game-123' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGame),
      });

      const result = await findGameByPin('1234');
      expect(result).toEqual(mockGame);
      expect(fetch).toHaveBeenCalledWith('/api/find-game?pin=1234');
    });

    it('returns null when game not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await findGameByPin('1234');
      expect(result).toBeNull();
    });
  });

  describe('joinGame', () => {
    it('successfully joins a game', async () => {
      const mockGame = { id: 'game-123' };
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGame),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const result = await joinGame('1234', 'Player 1');
      expect(result).toBe('game-123');
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('throws error when game not found', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(joinGame('1234', 'Player 1')).rejects.toThrow('Game not found');
    });

    it('throws error when join request fails', async () => {
      const mockGame = { id: 'game-123' };
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGame),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: 'Failed to join' }),
        });

      await expect(joinGame('1234', 'Player 1')).rejects.toThrow('Failed to join');
    });
  });
});