'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const HostGame: React.FC = () => {
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [nameError, setNameError] = useState('')
  const router = useRouter()

  const handleHostGame = async () => {
    const newErrors: string[] = []
    setNameError('')

    if (!name.trim()) {
      newErrors.push('Please enter your name')
      setNameError('Please enter your name')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
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
      setErrors([err instanceof Error ? err.message : 'An unknown error occurred'])
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
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>
          <Button onClick={handleHostGame}>
            Create and Join New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostGame