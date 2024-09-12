'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { joinGame } from '@/app/utils/gameUtils';

interface FormErrors {
  pin?: string;
  playerName?: string;
  general?: string;
}

export default function JoinGame() {
  const [pin, setPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!pin.trim()) {
      newErrors.pin = 'Please enter a game PIN';
    }
    
    if (!playerName.trim()) {
      newErrors.playerName = 'Please enter your name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const gameId = await joinGame(pin, playerName);
      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      if (error instanceof Error) {
        if (error.message === 'Game not found') {
          setErrors({ pin: 'Invalid game PIN. Please check and try again.' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An error occurred while joining the game' });
      }
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Join Game</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pin">Game PIN</Label>
              <Input 
                id="pin" 
                placeholder="Enter game PIN" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
              />
              {errors.pin && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.pin}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="playerName">Your Name</Label>
              <Input 
                id="playerName" 
                placeholder="Enter your name" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
              />
              {errors.playerName && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.playerName}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          {errors.general && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}
          <CardFooter className="flex justify-between mt-4">
            <Button type="submit">Join Game</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}