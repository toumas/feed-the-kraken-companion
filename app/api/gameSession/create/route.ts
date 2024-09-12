import { NextResponse } from 'next/server';
import { createGameSession, addPlayerToGameSession } from '@/models/gameSession';

export async function POST(request: Request) {
  try {
    const { hostName } = await request.json();

    if (!hostName) {
      return NextResponse.json({ error: 'Host name is required' }, { status: 400 });
    }

    // Generate a unique 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const gameSession = await createGameSession(pin);

    // Add the host as the first player
    await addPlayerToGameSession(gameSession.id, hostName);

    return NextResponse.json({ gameSession });
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json({ error: 'Failed to create game session' }, { status: 500 });
  }
}