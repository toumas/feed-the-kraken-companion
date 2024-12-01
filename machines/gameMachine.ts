import { setup, assign } from 'xstate';

export const gameMachine = setup({
  types: {
    context: {} as {
      hostId: string | null;
      hostName: string | null;
      players: Array<{ id: string; name: string }>;
    },
    events: {} as
      | { type: 'HOST_GAME'; hostId: string; hostName: string }
      | { type: 'JOIN_GAME'; playerId: string; playerName: string },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWEA2YAxABIDyAygCoD6A4gIICyAogNoAMAuoqAA4D2sbABds-AHY8QAD0QBGAGwAWADQgAnvICsczAE4A7Aq0HTWgBwHze9goC+dtagyYA7ihHZxUAGL8ATgAKeCjqYP6whABSpACSAHJ0TGxcUgJCohJSsggAzLl6mOwG7LlyAExaapoI5rpaDo4g4vwQcFLOYGmCnllIMogAtArVQ-ZNnTj4Xf3pvZL9OUrlowhyBlqY5aVySuyVlta2Dk7oWO6e3n5BIWER3RliC6A5ZYVaSgqWVRry5uWYJRaMp7A5WGzjBxAA */
  id: 'game',
  initial: 'idle',
  context: {
    hostId: null,
    hostName: null,
    players: [],
  },
  states: {
    idle: {
      on: {
        HOST_GAME: {
          target: 'waitingForPlayers',
          actions: assign({
            hostId: ({ event }) => event.hostId,
            hostName: ({ event }) => event.hostName,
          }),
        },
      },
    },
    waitingForPlayers: {
      on: {
        JOIN_GAME: {
          actions: assign({
            players: ({ context, event }) => [
              ...context.players,
              { id: event.playerId, name: event.playerName },
            ],
          }),
        },
      },
    },
  },
});

export default gameMachine;