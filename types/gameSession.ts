export interface GameSession {
  id: string;
  pin: string;
  createdAt: Date;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  gameSessionId: string;
}