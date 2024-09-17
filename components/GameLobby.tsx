'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Player {
  id: string;
  name: string;
}

interface GameSession {
  players: Player[];
}

interface GameLobbyProps {
  initialGameSession: GameSession;
  gameId: string;
}

export default function GameLobby({ initialGameSession, gameId }: GameLobbyProps) {
  const [gameSession, setGameSession] = useState<GameSession>(initialGameSession);

  useEffect(() => {
    const eventSource = new EventSource(`/api/game/${gameId}/events`);

    eventSource.onmessage = (event) => {
      const updatedGameSession = JSON.parse(event.data);
      setGameSession(updatedGameSession);
    };

    return () => {
      eventSource.close();
    };
  }, [gameId]);

  return (
    <>
      <h3 className="mt-4 mb-2 font-semibold">Players</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameSession.players.map(player => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}