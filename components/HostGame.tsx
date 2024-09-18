'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const HostGame: React.FC = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleHostGame = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const createResponse = await fetch('/api/gameSession/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostName: name }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || 'Failed to create game')
      }

      const createData = await createResponse.json()

      // Navigate to the game page
      router.push(`/game/${createData.gameSession.id}?playerId=${createData.playerId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Error hosting game:', err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Host a Game</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleHostGame} className="w-full">
            Create and Join New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostGame