'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Simple UUID generation function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const HostGame: React.FC = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleHostGame = async () => {
    console.log('Starting handleHostGame function');
    setError('');

    if (!name.trim()) {
      console.log('Name is empty, setting error');
      setError('Please enter your name');
      return;
    }

    try {
      console.log('Attempting to create a new workflow');
      // Create a new workflow
      const createResponse = await fetch('/api/workflows', {
        method: 'POST',
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        console.error('Failed to create workflow:', errorData);
        throw new Error(errorData.error || 'Failed to create workflow')
      }

      const { workflowId } = await createResponse.json()
      console.log('Workflow created successfully, workflowId:', workflowId);

      // Generate a separate hostId
      const hostId = generateUUID();
      console.log('Generated hostId:', hostId);

      console.log('Sending HOST_GAME event to the workflow');
      // Send HOST_GAME event to the workflow
      const hostResponse = await fetch(`/api/workflows/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'HOST_GAME',
          hostId: hostId,
          hostName: name,
        }),
      })

      if (!hostResponse.ok) {
        const errorData = await hostResponse.json()
        console.error('Failed to host game:', errorData);
        throw new Error(errorData.error || 'Failed to host game')
      }

      console.log('HOST_GAME event sent successfully');

      // Navigate to the game page
      console.log('Navigating to game page');
      router.push(`/game/${workflowId}`)
    } catch (err) {
      console.error('Error in handleHostGame:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
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