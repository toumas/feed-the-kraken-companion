import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface GameSession {
  id: string;
  pin: string;
  createdAt: Date;
  // Add other properties as needed, e.g., players, gameState, etc.
}

export async function createGameSession(pin: string): Promise<GameSession> {
  return prisma.gameSession.create({
    data: {
      pin,
    },
  })
}

export async function getGameSessionByPin(pin: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: {
      pin,
    },
  })
}

// ... existing code ...