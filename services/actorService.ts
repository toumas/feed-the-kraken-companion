import { AnyStateMachine, createActor } from "xstate";
import prisma from '@/lib/prisma';

// create an actor to be used in the API endpoints
// hydrate the actor if a gameId is provided
// otherwise, create a new gameId
// persist the actor state to the db
export async function getDurableActor({
  machine,
  gameId,
}: {
  machine: AnyStateMachine;
  gameId?: string;
}) {
  console.log('Starting getDurableActor function');
  console.log('Received gameId:', gameId);

  let restoredState;
  if (gameId) {
    console.log('Attempting to restore state for gameId:', gameId);
    restoredState = await prisma.gameSession.findUnique({
      where: { id: gameId },
      select: { persistedState: true },
    });

    if (!restoredState) {
      console.error('No restored state found for gameId:', gameId);
      throw new Error("Actor not found with the provided gameId");
    }

    console.log('Successfully restored state:', restoredState);
  } else {
    console.log('No gameId provided, creating a new game session');
    gameId = await createNewGameSession();
    console.log('Created new game session with id:', gameId);
  }

  console.log('Creating actor with machine and restored state');
  const actor = createActor(machine, {
    snapshot: restoredState?.persistedState,
  });

  console.log('Setting up actor subscription');
  // actor subcribe is called for every request which causes player join inaccuracies
  actor.subscribe({
    next: async () => {
      // on transition, persist the most recent actor state to the db
      const persistedState = actor.getPersistedSnapshot();
      console.log("Persisting state for gameId:", gameId);
      console.log("Persisted state:", persistedState);
      
      try {
        const result = await prisma.gameSession.update({
          where: { id: gameId },
          data: { persistedState },
        });

        if (!result) {
          throw new Error("Failed to update game session");
        }
        console.log("Successfully persisted state to database");
      } catch (error) {
        console.error("Error persisting actor state:", error);
        throw new Error(
          "Error persisting actor state. Verify db connection is configured correctly.",
        );
      }
    },
    error: (err) => {
      console.error("Error in actor subscription:", err);
      throw err;
    },
    complete: async () => {
      console.log("Actor is finished!");
      actor.stop();
    },
  });

  console.log('Starting actor');
  actor.start();

  console.log('Returning actor and gameId');
  return { actor, gameId };
}

async function createNewGameSession(): Promise<string> {
  const newSession = await prisma.gameSession.create({
    data: {
      pin: generatePin(),
      state: 'lobby',
    },
  });
  console.log('Created new game session:', newSession);
  return newSession.id;
}

function generatePin(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
