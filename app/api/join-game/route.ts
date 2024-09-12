import { NextResponse } from 'next/server';
import { getGameSessionByPin, addPlayerToGameSession } from '@/models/gameSession';

export async function POST(request: Request) {
  const { pin, playerName } = await request.json();

  try {
    const gameSession = await getGameSessionByPin(pin);

    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    await addPlayerToGameSession(gameSession.id, playerName);

    return NextResponse.json({ gameId: gameSession.id });
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}