'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinGame } from '@/app/utils/gameUtils';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

function JoinGame() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 6 || isNaN(Number(pin))) {
      setError('PIN must be a 6-digit number');
      return;
    }

    try {
      const response = await fetch('/api/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const text = await response.text();
      console.log('Response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Received non-JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join game');
      }

      router.push(`/game/${data.gameId}`);
    } catch (err) {
      console.error('Error joining game:', err);
      setError(err instanceof Error ? err.message : 'Failed to join game');
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Join Game</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <Input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 6-digit game PIN"
              maxLength={6}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" onClick={handleSubmit}>Join</Button>
      </CardFooter>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

export default JoinGame;