import { NextRequest, NextResponse } from 'next/server';
import { joinGame } from '@/app/utils/gameUtils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pin, name } = body;

  if (!pin || typeof pin !== 'string' || pin.length !== 6 || isNaN(Number(pin))) {
    return NextResponse.json({ message: 'Invalid PIN format' }, { status: 400 });
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ message: 'Invalid name' }, { status: 400 });
  }

  try {
    const gameId = await joinGame(pin, name);
    return NextResponse.json({ gameId });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 400 }
    );
  }
}