import prisma from '@/lib/prisma';
import type { Player, GameSession as GameSessionType } from '@/types/gameSession';

export type GameState = 'lobby' | 'in_progress' | 'completed';

export type GameSession = GameSessionType;

export async function createGameSession(pin: string, hostName: string): Promise<GameSession> {
  try {
    const gameSession = await prisma.gameSession.create({
      data: {
        pin,
        players: { 
          create: [{ name: hostName }]
        },
      },
    });

    const hostId = gameSession.players[0].id;
    const updatedGameSession = await prisma.gameSession.update({
      where: { id: gameSession.id },
      data: { hostId },
    });

    return {
      ...updatedGameSession,
      state: updatedGameSession.state as GameState,
    };
  } catch (error) {
    console.error('Error in createGameSession:', error);
    throw error;
  }
}

export async function getGameSessionByPin(pin: string): Promise<GameSession | null> {
  const gameSession = await prisma.gameSession.findUnique({
    where: { pin },
  });

  return gameSession ? { ...gameSession, state: gameSession.state as GameState } : null;
}

export async function getGameSessionById(id: string): Promise<GameSession | null> {
  const gameSession = await prisma.gameSession.findUnique({
    where: { id },
  });

  return gameSession ? { ...gameSession, state: gameSession.state as GameState } : null;
}

export async function addPlayerToGameSession(gameId: string, playerName: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameId },
    data: {
    },
  });
}

export async function getGameSessionWithPlayers(gameSessionId: string): Promise<GameSession | null> {
  const gameSession = await prisma.gameSession.findUnique({
    where: { id: gameSessionId },
  });

  return gameSession ? { ...gameSession, state: gameSession.state as GameState } : null;
}

export async function updateGameSessionState(gameId: string, state: GameState): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameId },
    data: { state },
  });
}

export async function updateGameSessionHostId(gameId: string, hostId: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: gameId },
    data: { hostId },
  });
}

export async function isPlayerHost(gameId: string, playerId: string): Promise<boolean> {
  const gameSession = await prisma.gameSession.findUnique({
    where: { id: gameId },
    select: { hostId: true },
  });
  return gameSession?.hostId === playerId;
}