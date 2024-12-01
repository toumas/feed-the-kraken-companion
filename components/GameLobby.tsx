'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GameSession } from '@/types/gameSession';

interface GameLobbyProps {
  gameSession: GameSession;
  gameId: string;
  playerId: string;
}

export default function GameLobby({ gameSession, gameId, playerId }: GameLobbyProps) {
  const players = gameSession?.persistedState?.context?.players || [];

  return (
    <>
      <h3 className="mt-4 mb-2 font-semibold">Players</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map(player => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.id === gameSession.hostId ? 'Host' : 'Player'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}