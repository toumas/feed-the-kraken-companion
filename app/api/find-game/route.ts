import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    const gameSession = await prisma.gameSession.findFirst({
      where: { 
        pin: pin.toUpperCase(),
        state: { not: 'finished' }
      }
    });

    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ id: gameSession.id });

  } catch (error) {
    console.error('Error in find-game API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}