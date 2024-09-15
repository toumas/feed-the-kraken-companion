import { POST } from '@/app/api/join-game/route';
import { getGameSessionByPin, addPlayerToGameSession } from '@/models/gameSession';

jest.mock('@/models/gameSession', () => ({
  getGameSessionByPin: jest.fn(),
  addPlayerToGameSession: jest.fn(),
}));

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({
      status: options?.status || 200,
      json: async () => body,
    })),
  },
}));

// Mock NextRequest
class MockNextRequest {
  private url: string;
  private method: string;
  private body: string;

  constructor(url: string, options: { method: string; body: string }) {
    this.url = url;
    this.method = options.method;
    this.body = options.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
}

describe('/api/join-game', () => {
  it('returns 404 when game is not found', async () => {
    (getGameSessionByPin as jest.Mock).mockResolvedValue(null);

    const req = new MockNextRequest('http://localhost:3000/api/join-game', {
      method: 'POST',
      body: JSON.stringify({ pin: '123456', playerName: 'Test Player' }),
    }) as any;

    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Game not found');
  });

  it('successfully joins a game', async () => {
    const mockGameSession = { id: 'game-id', pin: '123456' };
    (getGameSessionByPin as jest.Mock).mockResolvedValue(mockGameSession);
    (addPlayerToGameSession as jest.Mock).mockResolvedValue(undefined);

    const req = new MockNextRequest('http://localhost:3000/api/join-game', {
      method: 'POST',
      body: JSON.stringify({ pin: '123456', playerName: 'Test Player' }),
    }) as any;

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.gameId).toBe('game-id');
  });

  // Add more tests as needed
});