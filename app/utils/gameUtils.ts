import { generateUUID } from "@/lib/utils";

export async function joinGame(pin: string, playerName: string): Promise<string> {
  const game = await findGameByPin(pin);
  
  if (!game) {
    throw new Error('Game not found');
  }

  const workflowId = game.id;
  const playerId = generateUUID();

  const response = await fetch(`http://localhost:3000/api/workflows/${workflowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'JOIN_GAME',
      playerId,
      playerName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to join game');
  }

  return workflowId;
}

export async function findGameByPin(pin: string): Promise<{ id: string } | null> {
  try {
    const response = await fetch(`/api/find-game?pin=${pin}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to find game');
    }
    return response.json();
  } catch (error) {
    console.error('Error finding game:', error);
    return null;
  }
}
