export type GameState = 'lobby' | 'in_progress' | 'completed';

export interface Player {
  id: string;
  name: string;
}

export interface GameSession {
  id: string;
  pin: string;
  hostId: string | null;
  state: GameState;
}