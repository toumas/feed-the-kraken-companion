import { POST } from '@/app/api/host-game/route';
import { NextResponse } from 'next/server';

// Mock fetch
global.fetch = jest.fn();

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({
      status: options?.status || 200,
      json: async () => body,
    })),
  },
}));

// Mock Request class
class MockRequest {
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

describe('POST /api/host-game', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('creates a workflow and sends host/join events', async () => {
    const mockWorkflowId = 'test-workflow-id';
    
    // Mock successful workflow creation
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ workflowId: mockWorkflowId }),
    });

    // Mock successful HOST_GAME event
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    // Mock successful JOIN_GAME event
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const req = new MockRequest('http://localhost:3000/api/host-game', {
      method: 'POST',
      body: JSON.stringify({ hostName: 'Test Host' }),
    }) as unknown as Request;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ workflowId: mockWorkflowId });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('returns 400 if hostName is missing', async () => {
    const req = new MockRequest('http://localhost:3000/api/host-game', {
      method: 'POST',
      body: JSON.stringify({}),
    }) as unknown as Request;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid host name' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles workflow creation failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Workflow creation failed' }),
    });

    const req = new MockRequest('http://localhost:3000/api/host-game', {
      method: 'POST',
      body: JSON.stringify({ hostName: 'Test Host' }),
    }) as unknown as Request;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Workflow creation failed');
    expect(console.error).toHaveBeenCalledWith(
      'Error in host-game API:',
      expect.any(Error)
    );
  });
});