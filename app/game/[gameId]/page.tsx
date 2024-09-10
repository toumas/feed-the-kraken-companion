import React from 'react';
import { getGameSessionWithPlayers } from '@/models/gameSession';
import CopyPinButton from '@/components/CopyPinButton';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Game Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Game ID: {gameId}</p>
        <p>Game PIN: {gameSession.pin}</p>
        <CopyPinButton pin={gameSession.pin} />
        <p>Players:</p>
        <ul>
          {gameSession.players.map(player => (
            <li key={player.id}>{player.id}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}