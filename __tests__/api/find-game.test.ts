import { NextRequest } from 'next/server';
import { GET } from '@/app/api/find-game/route';
import { getGameSessionByPin } from '@/models/gameSession';

jest.mock('@/models/gameSession');
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    nextUrl: new URL(url),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

describe('GET /api/find-game', () => {
  it('should return 400 if PIN is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/find-game');
    const res = await GET(req);
    
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'PIN is required' });
  });

  it('should return 404 if game is not found', async () => {
    (getGameSessionByPin as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/find-game?pin=123456');
    const res = await GET(req);
    
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Game not found' });
  });

  it('should return game ID if game is found', async () => {
    (getGameSessionByPin as jest.Mock).mockResolvedValue({ id: 'game123' });

    const req = new NextRequest('http://localhost:3000/api/find-game?pin=123456');
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: 'game123' });
  });

  it('should return 500 if an error occurs', async () => {
    (getGameSessionByPin as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new NextRequest('http://localhost:3000/api/find-game?pin=123456');
    const res = await GET(req);
    
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to find game' });
  });
});