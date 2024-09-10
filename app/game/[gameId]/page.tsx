import React from 'react';
import { getGameSessionWithPlayers } from '@/models/gameSession';
import CopyPinButton from '@/components/CopyPinButton';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      </CardContent>
    </Card>
  );
}