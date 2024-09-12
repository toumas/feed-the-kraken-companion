import { NextResponse } from 'next/server';
import { getGameSessionByPin } from '@/models/gameSession';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');

  if (!pin) {
    return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
  }

  try {
    const gameSession = await getGameSessionByPin(pin);

    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ id: gameSession.id });
  } catch (error) {
    console.error('Error finding game:', error);
    return NextResponse.json({ error: 'Failed to find game' }, { status: 500 });
  }
}