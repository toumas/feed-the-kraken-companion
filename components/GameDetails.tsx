'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CopyPinButton from '@/components/CopyPinButton';
import GameLobby from '@/components/GameLobby';
import { GameSession } from '@/types/gameSession';

interface GameDetailsProps {
  initialGameSession: GameSession;
  gameId: string;
  playerId: string;
}

export default function GameDetails({ initialGameSession, gameId, playerId }: GameDetailsProps) {
  const [gameSession, setGameSession] = useState<GameSession | null>(initialGameSession);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Game Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Game ID: {gameId}</p>
        <p>Game PIN: {gameSession.pin}</p>
        <p>Game State: {gameSession.state}</p>
        <CopyPinButton pin={gameSession.pin} />
        <GameLobby 
          gameSession={gameSession} 
          gameId={gameId} 
          playerId={playerId}
        />
      </CardContent>
    </Card>
  );
}