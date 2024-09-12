import React, { useEffect, useState } from 'react';
import { GameSession } from '@/types/gameSession';

interface GameLobbyProps {
  initialGameSession: GameSession;
}

export default function GameLobby({ initialGameSession }: GameLobbyProps) {
  const [gameSession, setGameSession] = useState<GameSession>(initialGameSession);

  useEffect(() => {
    const eventSource = new EventSource(`/api/game/${gameSession.id}/events`);

    // ... rest of the useEffect ...

  }, [gameSession.id]);

  // Render game lobby using gameSession data
  // ...
}