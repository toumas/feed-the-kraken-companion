import { getGameSessionByPin, addPlayerToGameSession } from '@/models/gameSession';

// Remove the PrismaClient import and initialization

export async function joinGame(pin: string): Promise<string> {
  const gameSession = await getGameSessionByPin(pin);
  if (!gameSession) {
    throw new Error('Game not found');
  }
  
  // Add the player to the game session
  // For now, we'll use a random player ID. In a real app, you'd use the authenticated user's ID
  const playerId = Math.random().toString(36).substring(7);
  await addPlayerToGameSession(gameSession.id, playerId);
  
  return gameSession.id;
}

export async function findGameByPin(pin: string): Promise<{ id: string } | null> {
  const gameSession = await getGameSessionByPin(pin);
  return gameSession ? { id: gameSession.id } : null;
}
