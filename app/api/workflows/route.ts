import { NextResponse } from 'next/server';
import { getDurableActor } from '@/services/actorService';
import { gameMachine } from '@/machines/gameMachine'; // Assuming you have a game machine defined

export async function POST() {
  console.log("Starting new workflow...");
  try {
    // Create a new actor and get its ID
    const { gameId: workflowId } = await getDurableActor({
      machine: gameMachine,
    });
    
    return NextResponse.json(
      { message: "New workflow created successfully", workflowId },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error starting workflow:", err);
    return NextResponse.json(
      { error: "Error starting workflow", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}