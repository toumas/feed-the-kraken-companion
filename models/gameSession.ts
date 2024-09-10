import prisma from '@/lib/prisma';

export interface GameSession {
  id: string;
  pin: string;
  createdAt: Date;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  gameSessionId: string;
}

export async function createGameSession(pin: string): Promise<GameSession> {
  return prisma.gameSession.create({
    data: {
      pin,
    },
    include: { players: true },
  });
}

export async function getGameSessionByPin(pin: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: { pin },
    include: { players: true },
  });
}

export async function addPlayerToGameSession(gameSessionId: string, name: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameSessionId },
    data: {
      players: {
        create: { name }
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