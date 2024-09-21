import { NextRequest, NextResponse } from 'next/server';
import { getDurableActor } from "@/services/actorService";
import { gameMachine } from '@/machines/gameMachine';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  const { workflowId } = params;
  const event = await req.json();

  try {
    const { actor } = await getDurableActor({
      machine: gameMachine,
      gameId: workflowId,
    });
    actor.send(event);

    return NextResponse.json({ message: "Event received. Issue a GET request to see the current workflow state" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error sending event" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  const { workflowId } = params;
  
  const persistedState = await prisma.machineState.findUnique({
    where: { workflowId },
  });

  if (!persistedState) {
    return NextResponse.json({ error: "Workflow state not found" }, { status: 404 });
  }

  return NextResponse.json(persistedState);
}