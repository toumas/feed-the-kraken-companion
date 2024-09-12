'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

function JoinGame() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [pinError, setPinError] = useState('');
  const [nameError, setNameError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    setPinError('');
    setNameError('');

    if (pin.length !== 6 || isNaN(Number(pin))) {
      newErrors.push('PIN must be a 6-digit number');
      setPinError('PIN must be a 6-digit number');
    }

    if (!name.trim()) {
      newErrors.push('Please enter your name');
      setNameError('Please enter your name');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join game');
      }

      const data = await response.json();
      router.push(`/game/${data.gameId}`);
    } catch (err) {
      console.error('Error joining game:', err);
      setErrors([err instanceof Error ? err.message : 'Failed to join game']);
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
            <div className="space-y-2">
              <Label htmlFor="pin">Game PIN</Label>
              <Input
                id="pin"
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit game PIN"
                maxLength={6}
                required
                className={pinError ? "border-red-500" : ""}
              />
              {pinError && <p className="text-sm text-red-500">{pinError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" onClick={handleSubmit}>Join</Button>
      </CardFooter>
    </Card>
  );
}

export default JoinGame;