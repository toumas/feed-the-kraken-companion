import { NextResponse } from 'next/server';
import { getGameSessionById, updateGameSessionState, isPlayerHost } from '@/models/gameSession';
import { EventEmitter } from 'events';

// Create a global event emitter
const eventEmitter = new EventEmitter();

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  let playerId;

  try {
    const body = await request.json();
    playerId = body.playerId;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  try {
    const gameSession = await getGameSessionById(gameId);

    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const isHost = await isPlayerHost(gameId, playerId);
    if (!isHost) {
      return NextResponse.json({ error: 'Only the host can start the game' }, { status: 403 });
    }

    if (gameSession.players.length < 5 || gameSession.players.length > 11) {
      return NextResponse.json({ error: 'Invalid number of players' }, { status: 400 });
    }

    // Update game state to 'in_progress'
    const updatedGameSession = await updateGameSessionState(gameId, 'in_progress');

    // Emit an event with the updated game session
    eventEmitter.emit(`gameUpdate:${gameId}`, updatedGameSession);

    return NextResponse.json({ message: 'Game started successfully', gameSession: updatedGameSession });
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const listener = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      eventEmitter.on(`gameUpdate:${gameId}`, listener);

      request.signal.addEventListener('abort', () => {
        eventEmitter.off(`gameUpdate:${gameId}`, listener);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}