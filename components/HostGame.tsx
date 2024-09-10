'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

const HostGame: React.FC = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleHostGame = async () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
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
        throw new Error(`Failed to create game: ${errorData.error || 'Unknown error'}`)
      }

      const createData = await createResponse.json()
      console.log('Game created:', createData)

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
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleHostGame} disabled={!name.trim()}>
            Create and Join New Game
          </Button>
        </div>
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