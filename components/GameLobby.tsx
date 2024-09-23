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
  console.log('GameLobby', gameSession, gameId, playerId);
  const { toast } = useToast();

  const isHost = gameSession.hostId === playerId;
  const canStartGame = gameSession.players.length >= 5 && gameSession.players.length <= 11;

  const handleStartGame = async () => {
    if (!isHost) return;

    try {
      const response = await fetch(`/api/game/${gameId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start game');
      }

      toast({
        title: "Game Started",
        description: "The game has been successfully started!",
      });
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start game',
        variant: "destructive",
      });
    }
  };

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
          {gameSession.persistedState.context.players.map(player => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.id === gameSession.hostId ? 'Host' : 'Player'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        {isHost && (
          <Button 
            onClick={handleStartGame} 
            disabled={!canStartGame}
          >
            Start Game
          </Button>
        )}
        {!canStartGame && (
          <p className="text-sm text-muted-foreground mt-2">
            {gameSession.players.length < 5 
              ? `Need at least ${5 - gameSession.players.length} more player(s) to start`
              : gameSession.players.length > 11
                ? `Too many players. Maximum is 11.`
                : ''}
          </p>
        )}
      </div>
    </>
  );
}