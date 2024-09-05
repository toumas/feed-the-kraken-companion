import { NextRequest, NextResponse } from 'next/server';
import { joinGame } from '@/app/utils/gameUtils';

export async function POST(req: NextRequest) {
  console.log('Received request:', req.method, req.url);

  const body = await req.json();
  console.log('Request body:', body);

  const { pin } = body;

  if (!pin || typeof pin !== 'string' || pin.length !== 6 || isNaN(Number(pin))) {
    console.log('Invalid PIN format:', pin);
    return NextResponse.json({ message: 'Invalid PIN format' }, { status: 400 });
  }

  try {
    console.log('Attempting to join game with PIN:', pin);
    const gameId = await joinGame(pin);
    console.log('Game joined successfully, gameId:', gameId);
    return NextResponse.json({ gameId });
  } catch (error) {
    console.error('Error in join-game API:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 400 }
    );
  }
}