import { NextResponse } from 'next/server';
import { generateUniquePin } from '@/utils/pinGenerator';
import { createGameSession } from '@/models/gameSession';

export async function POST() {
  try {
    const pin = await generateUniquePin();
    const gameSession = await createGameSession(pin);
    return NextResponse.json({ success: true, gameSession: { id: gameSession.id, pin: gameSession.pin } }, { status: 201 });
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json({ success: false, error: 'Failed to create game session' }, { status: 500 });
  }
}