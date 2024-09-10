import { getGameSessionByPin, addPlayerToGameSession } from '@/models/gameSession';

// Remove the PrismaClient import and initialization

export async function joinGame(pin: string, name: string): Promise<string> {
  const gameSession = await getGameSessionByPin(pin);
  if (!gameSession) {
    throw new Error('Game not found');
  }
  
  await addPlayerToGameSession(gameSession.id, name);
  
  return gameSession.id;
}

export async function findGameByPin(pin: string): Promise<{ id: string } | null> {
  const gameSession = await getGameSessionByPin(pin);
  return gameSession ? { id: gameSession.id } : null;
}
