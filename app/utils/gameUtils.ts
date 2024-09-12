export async function joinGame(pin: string, playerName: string): Promise<string> {
  const response = await fetch('/api/join-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin, playerName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to join game');
  }

  const data = await response.json();
  return data.gameId;
}

export async function findGameByPin(pin: string): Promise<{ id: string } | null> {
  const response = await fetch(`/api/find-game?pin=${pin}`);
  
  if (!response.ok) {
    return null;
  }

  return response.json();
}
