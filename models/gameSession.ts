import { v4 as uuidv4 } from 'uuid';

// You might want to use a database in a real application
let gameSessions: GameSession[] = [];

export interface GameSession {
  id: string;
  pin: string;
  createdAt: Date;
  // Add other properties as needed, e.g., players, gameState, etc.
}

export async function createGameSession(pin: string): Promise<GameSession> {
  const newSession: GameSession = {
    id: uuidv4(),
    pin,
    createdAt: new Date(),
  };
  gameSessions.push(newSession);
  return newSession;
}

export async function getGameSessionByPin(pin: string): Promise<GameSession | undefined> {
  return gameSessions.find(session => session.pin === pin);
}