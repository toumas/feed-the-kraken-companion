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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCWEA2YAxABIDyAygCoD6A4gIICyAogNoAMAuoqAA4D2sbABds-AHY8QAD0QBGAGwAWTOzVq5ATgDM7AOwBWJQYUAaEAE95BuZk16FBvZrmubmgEx6Avt-OoMTAB3FBFscSgAMX4AJwAFPBQLMBjYQgApUgBJADk6JjYuKQEhUQkpWQRtbU1VPXZtOS8DBu0PE3MrBAAOWyVNAfsBrT09bW7fPxBxfgg4KQCwYsEw8qQZRABaM0sthV9-dCxcAmXSsUl1yqUPTvlDTA8GuSV9HXZ2pW0DkEXg0NEEWi8USyVSZ1Wl1AlUatSMCm6zhe2gMHhRdwQcm6HkwxkaHiU3RqSj0igmkyAA */
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
            players: ({ event }) => [{ id: event.hostId, name: event.hostName }],
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