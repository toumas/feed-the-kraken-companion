import React from 'react';
import { getGameSessionWithPlayers } from '@/models/gameSession';
import GameDetails from '@/components/GameDetails';

interface GamePageProps {
  params: {
    gameId: string;
  };
  searchParams: {
    playerId?: string;
  };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { gameId } = params;
  const { playerId } = searchParams;
  const initialGameSession = await getGameSessionWithPlayers(gameId);

  if (!initialGameSession) {
    return <div>Game not found</div>;
  }

  return (
    <GameDetails
      initialGameSession={initialGameSession}
      gameId={gameId}
      playerId={playerId || ''}
    />
  );
}