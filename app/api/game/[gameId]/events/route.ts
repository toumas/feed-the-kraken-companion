import { NextResponse } from 'next/server';
import { getGameSessionById } from '@/models/gameSession';

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  // Set headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async () => {
    try {
      const gameSession = await getGameSessionById(gameId);
      if (!gameSession) {
        await writer.close();
        return;
      }

      const event = `data: ${JSON.stringify(gameSession)}\n\n`;
      await writer.write(new TextEncoder().encode(event));

      // Send updates every 0.5 seconds
      setTimeout(sendEvent, 500);
    } catch (error) {
      console.error('Error sending SSE:', error);
      await writer.close();
    }
  };

  sendEvent();

  return new NextResponse(stream.readable, { headers });
}