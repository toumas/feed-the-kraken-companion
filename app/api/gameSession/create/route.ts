import { NextResponse } from 'next/server';
import { createGameSession } from '@/models/gameSession';

export async function POST(request: Request) {
  try {
    const { hostName } = await request.json();

    if (!hostName) {
      return NextResponse.json({ error: 'Host name is required' }, { status: 400 });
    }

    // Generate a unique 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const gameSession = await createGameSession(pin, hostName);

    return NextResponse.json({ gameSession, playerId: gameSession.hostId });
  } catch (error) {
    console.error('Error creating game session:', error);
    let errorMessage = 'Failed to create game session';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}