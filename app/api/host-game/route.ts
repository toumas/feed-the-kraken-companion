import { NextResponse } from 'next/server';
import { generateUUID } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { hostName } = await request.json();

    if (!hostName || typeof hostName !== 'string') {
      return NextResponse.json({ error: 'Invalid host name' }, { status: 400 });
    }

    // Create a new workflow
    const createResponse = await fetch('http://localhost:3000/api/workflows', {
      method: 'POST',
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.error || 'Failed to create workflow');
    }

    const { workflowId } = await createResponse.json();

    // Generate a separate hostId
    const hostId = generateUUID();

    // Send HOST_GAME event to the workflow
    const hostResponse = await fetch(`http://localhost:3000/api/workflows/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'HOST_GAME',
        hostId: hostId,
        hostName: hostName,
      }),
    });

    if (!hostResponse.ok) {
      const errorData = await hostResponse.json();
      throw new Error(errorData.error || 'Failed to host game');
    }

    // Send JOIN_GAME event to the workflow
    const joinResponse = await fetch(`http://localhost:3000/api/workflows/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'JOIN_GAME',
        playerId: hostId,
        playerName: hostName,
      }),
    });

    if (!joinResponse.ok) {
      const errorData = await joinResponse.json();
      throw new Error(errorData.error || 'Failed to join game');
    }

    return NextResponse.json({ workflowId });
  } catch (error) {
    console.error('Error in host-game API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}