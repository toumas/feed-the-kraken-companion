import { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma';

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
  });
}

export async function getGameSessionByPin(pin: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: {
      pin,
    },
  });
}

export async function addPlayerToGameSession(gameSessionId: string, playerId: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameSessionId },
    data: {
      players: {
        create: { id: playerId }
      }
    }
  });
}

export async function getGameSessionWithPlayers(gameSessionId: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: { id: gameSessionId },
    include: { players: true }
  });
}

// ... existing code ...