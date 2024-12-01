
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

    return NextResponse.json({ 
      workflowId: gameSession.id,
      pin: gameSession.pin,
      state: gameSession.state
    });

  } catch (error) {
    console.error('Error in workflows search:', error);
    return NextResponse.json(
      { error: 'Failed to search for workflow' },
      { status: 500 }
    );
  }
}