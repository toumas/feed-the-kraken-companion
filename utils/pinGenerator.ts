import { getGameSessionByPin } from '@/models/gameSession';

const PIN_LENGTH = 6;

export async function generateUniquePin(): Promise<string> {
  while (true) {
    const pin = Math.floor(Math.random() * Math.pow(10, PIN_LENGTH)).toString().padStart(PIN_LENGTH, '0');
    const existingSession = await getGameSessionByPin(pin);
    if (!existingSession) {
      return pin;
    }
  }
}