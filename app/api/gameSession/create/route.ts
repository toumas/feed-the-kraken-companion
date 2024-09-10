import { NextRequest, NextResponse } from 'next/server';
import { generateUniquePin } from '@/utils/pinGenerator';
import { createGameSession } from '@/models/gameSession';
import { joinGame } from '@/app/utils/gameUtils';

export async function POST(req: NextRequest) {
  try {
    const { hostName } = await req.json();
    const pin = await generateUniquePin();
    const gameSession = await createGameSession(pin);
    
    // Join the game as the host
    await joinGame(pin, hostName);

    return NextResponse.json({ success: true, gameSession: { id: gameSession.id, pin: gameSession.pin } }, { status: 201 });
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json({ success: false, error: 'Failed to create game session' }, { status: 500 });
  }
}