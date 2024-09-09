'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const HostGame: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleHostGame = async () => {
    try {
      const createResponse = await fetch('/api/gameSession/create', {
        method: 'POST',
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(`Failed to create game: ${errorData.error || 'Unknown error'}`)
      }

      const createData = await createResponse.json()
      console.log('Game created:', createData)

      // Join the created game
      const joinResponse = await fetch('/api/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: createData.gameSession.pin }),
      })

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json()
        throw new Error(`Failed to join game: ${errorData.message || 'Unknown error'}`)
      }

      const joinData = await joinResponse.json()
      console.log('Game joined:', joinData)

      // Navigate to the game page
      router.push(`/game/${createData.gameSession.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Error hosting game:', err)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Host a Game</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleHostGame}>Create and Join New Game</Button>
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