import { GET } from '../../../../../app/api/game/[gameId]/events/route';
import { getGameSessionById } from '@/models/gameSession';
import { NextResponse } from 'next/server';

jest.mock('@/models/gameSession');
jest.mock('next/server', () => ({
  NextResponse: jest.fn().mockImplementation((body, init) => ({
    body,
    ...init,
  })),
}));

describe('GET function', () => {
  let mockRequest: Request;
  let mockParams: { gameId: string };
  let mockWriter: any;
  let mockReadableStream: ReadableStream;

  beforeEach(() => {
    jest.useFakeTimers();
    mockRequest = {} as Request;
    mockParams = { gameId: 'test-game-id' };
    mockWriter = {
      write: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };
    mockReadableStream = {} as ReadableStream;

    global.TransformStream = jest.fn().mockImplementation(() => ({
      writable: { getWriter: () => mockWriter },
      readable: mockReadableStream,
    }));

    global.TextEncoder = jest.fn().mockImplementation(() => ({
      encode: jest.fn().mockReturnValue(new Uint8Array()),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should set up SSE headers correctly', async () => {
    const response = await GET(mockRequest, { params: mockParams });

    expect(response.headers).toBeInstanceOf(Headers);
    expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    expect(response.headers.get('Cache-Control')).toBe('no-cache');
    expect(response.headers.get('Connection')).toBe('keep-alive');
  });

  it('should send game session data as SSE', async () => {
    const mockGameSession = { id: 'test-game-id', data: 'test-data' };
    (getGameSessionById as jest.Mock).mockResolvedValue(mockGameSession);

    await GET(mockRequest, { params: mockParams });
    jest.advanceTimersByTime(5000);

    expect(getGameSessionById).toHaveBeenCalledWith('test-game-id');
    expect(mockWriter.write).toHaveBeenCalledWith(
      expect.any(Uint8Array)
    );
  });

  it('should close the writer if game session is not found', async () => {
    (getGameSessionById as jest.Mock).mockResolvedValue(null);

    await GET(mockRequest, { params: mockParams });
    jest.advanceTimersByTime(5000);

    expect(getGameSessionById).toHaveBeenCalledWith('test-game-id');
    expect(mockWriter.close).toHaveBeenCalled();
  });

  it('should handle errors and close the writer', async () => {
    const mockError = new Error('Test error');
    (getGameSessionById as jest.Mock).mockRejectedValue(mockError);

    console.error = jest.fn();

    await GET(mockRequest, { params: mockParams });
    jest.advanceTimersByTime(5000);

    expect(getGameSessionById).toHaveBeenCalledWith('test-game-id');
    expect(console.error).toHaveBeenCalledWith('Error sending SSE:', mockError);
    expect(mockWriter.close).toHaveBeenCalled();
  });

  it('should continue sending events every 5 seconds', async () => {
    const mockGameSession = { id: 'test-game-id', data: 'test-data' };
    (getGameSessionById as jest.Mock).mockResolvedValue(mockGameSession);

    await GET(mockRequest, { params: mockParams });

    // Advance time and run timers four times
    for (let i = 0; i < 4; i++) {
      await jest.advanceTimersByTimeAsync(5000);
    }

    expect(getGameSessionById).toHaveBeenCalledTimes(5); // Initial call + 4 timer calls
    expect(mockWriter.write).toHaveBeenCalledTimes(5);
  });
});