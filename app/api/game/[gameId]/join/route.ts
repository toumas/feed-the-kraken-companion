import { NextResponse } from 'next/server';
import { addPlayerToGameSession, getGameSessionById } from '@/models/gameSession';

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  const { playerName } = await request.json();

  try {
    const gameSession = await getGameSessionById(gameId);
    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    await addPlayerToGameSession(gameId, playerName);

    // Fetch the updated game session
    const updatedGameSession = await getGameSessionById(gameId);

    return NextResponse.json(updatedGameSession);
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}