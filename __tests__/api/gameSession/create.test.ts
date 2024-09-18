import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/gameSession/create/route';
import { createGameSession, addPlayerToGameSession } from '@/models/gameSession';

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

jest.mock('@/models/gameSession', () => ({
  createGameSession: jest.fn(),
  addPlayerToGameSession: jest.fn(),
}));

describe('POST /api/gameSession/create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a game session and add host as first player', async () => {
    const mockGameSession = { id: 'mock-id', pin: '123456' };
    (createGameSession as jest.Mock).mockResolvedValue(mockGameSession);

    const req = {
      json: jest.fn().mockResolvedValue({ hostName: 'TestHost' }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({ gameSession: mockGameSession });
    expect(createGameSession).toHaveBeenCalledWith(expect.any(String), 'TestHost');
    expect(addPlayerToGameSession).not.toHaveBeenCalled();
  });

  it('should return 400 if hostName is missing', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toEqual({ error: 'Host name is required' });
    expect(createGameSession).not.toHaveBeenCalled();
    expect(addPlayerToGameSession).not.toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    (createGameSession as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = {
      json: jest.fn().mockResolvedValue({ hostName: 'TestHost' }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({ error: 'Failed to create game session: Database error' });
  });
});