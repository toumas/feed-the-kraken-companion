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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWEA2YAxABIDyAygCoD6A4gIICyAogNoAMAuoqAA4D2sbABds-AHY8QAD0QBGAGwAWADQgAnvKUBOTNoDsCgKwKATEYC+FtagyYAFoNHiohWswByzAEr1KzagAFAEkPDm4kEAEhUQkpWQQAZjklTCMlBQAOfSM1TQRMuTSrG3QsR1hnVwApUlC6JjYuKWiRMUlIhKVCzCVEnLz5I0zMU1NjM0sSkHF+CDgpWzAWwTa4zsQAWgVBhG3ppZx8ZcjW2I7QLtNduX1E0fZk8wOyhydsFxWY9vjERMSFHptKY5Nlchp5Jl2L0jE8pqU7AB3FBtFwAMX4ACdAngUOowJj4KdVudfggFNpUtp2JMblCYXCrFYgA */
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
          target: 'hosting',
          actions: assign({
            hostId: ({ event }) => event.hostId,
            hostName: ({ event }) => event.hostName,
          }),
        },
      },
    },
    hosting: {
      on: {
        JOIN_GAME: {
          target: 'waitingForPlayers',
          actions: assign({
            players: ({ context, event }) => [
              ...context.players,
              { id: event.playerId, name: event.playerName },
            ],
          }),
        },
      },
    },
    waitingForPlayers: {
      // Add more logic for waiting state
    },
  },
});

export default gameMachine;