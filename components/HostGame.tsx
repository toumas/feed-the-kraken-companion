'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const HostGame: React.FC = () => {
  const [pin, setPin] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleHostGame = async () => {
    try {
      const response = await fetch('/api/gameSession/create', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create game')
      }

      const data = await response.json()
      setPin(data.gameSession.pin)
      setError(null)
    } catch (err) {
      setError('Failed to create game. Please try again.')
      console.error('Error hosting game:', err)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Host a Game</CardTitle>
      </CardHeader>
      <CardContent>
        {!pin && (
          <Button onClick={handleHostGame}>Create New Game</Button>
        )}
        {pin && (
          <div className="space-y-2">
            <p className="font-semibold">Game PIN: {pin}</p>
            <p>Share this PIN with other players to join your game.</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default HostGame