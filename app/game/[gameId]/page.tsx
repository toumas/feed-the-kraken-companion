import React from 'react';
import { getGameSessionWithPlayers } from '@/models/gameSession';

interface GamePageProps {
  params: {
    gameId: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = params;
  const gameSession = await getGameSessionWithPlayers(gameId);

  if (!gameSession) {
    return <div>Game not found</div>;
  }

  return (
    <div>
      <h1>Game Page</h1>
      <p>Game ID: {gameId}</p>
      <p>Players:</p>
      <ul>
        {gameSession.players.map(player => (
          <li key={player.id}>{player.id}</li>
        ))}
      </ul>
    </div>
  );
}