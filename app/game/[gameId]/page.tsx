import React from 'react';
import { getGameSessionWithPlayers } from '@/models/gameSession';
import CopyPinButton from '@/components/CopyPinButton';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GameLobby from '@/components/GameLobby';

interface GamePageProps {
  params: {
    gameId: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = params;
  const initialGameSession = await getGameSessionWithPlayers(gameId);

  if (!initialGameSession) {
    return <div>Game not found</div>;
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Game Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Game ID: {gameId}</p>
        <p>Game PIN: {initialGameSession.pin}</p>
        <CopyPinButton pin={initialGameSession.pin} />
        <GameLobby initialGameSession={initialGameSession} gameId={gameId} />
      </CardContent>
    </Card>
  );
}