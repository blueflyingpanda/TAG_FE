import type { GameState, User } from '../types';

const GAME_STATE_STORAGE_KEY = 'tag_game_state';
const USER_STORAGE_KEY = 'tag_user';

export const storage = {
  getGameState: (): GameState | null => {
    try {
      const stored = localStorage.getItem(GAME_STATE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveGameState: (state: GameState): void => {
    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state));
  },

  clearGameState: (): void => {
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
  },

  // User
  getUser: (): User | null => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveUser: (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

