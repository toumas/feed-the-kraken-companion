import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getGameSessionByPin(pin: string) {
  return prisma.gameSession.findUnique({
    where: { pin },
  });
}

export async function createGameSession(pin: string, hostName: string) {
  return prisma.gameSession.create({
    data: {
      pin,
    },
  });
}

export async function addPlayerToGameSession(gameSessionId: string, name: string) {
  return prisma.gameSession.update({
    where: { id: gameSessionId },
  });
}