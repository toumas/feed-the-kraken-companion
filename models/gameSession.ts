import prisma from '@/lib/prisma';
import type { GameSession, Player } from '@/types/gameSession';

export type { GameSession, Player };

export async function createGameSession(pin: string): Promise<GameSession> {
  return prisma.gameSession.create({
    data: {
      pin,
      players: { create: [] }, // Initialize with an empty array of players
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

export async function getGameSessionById(id: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: { id },
    include: { players: true },
  });
}

export async function addPlayerToGameSession(gameId: string, playerName: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameId },
    data: {
      players: {
        create: { name: playerName },
      },
    },
  });
}

export async function getGameSessionWithPlayers(gameSessionId: string): Promise<GameSession | null> {
  return prisma.gameSession.findUnique({
    where: { id: gameSessionId },
    include: { players: true }
  });
}