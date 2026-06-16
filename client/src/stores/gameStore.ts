import { create } from 'zustand';
import { GameState, GameSettings, Resources, Hero, City, Faction, GameEvent } from '../../shared/types';

interface GameStore {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  setGameState: (state: GameState) => void;
  updateGameState: (partial: Partial<GameState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  updateResources: (resources: Partial<Resources>) => void;
  updateHero: (heroId: string, updates: Partial<Hero>) => void;
  updateCity: (cityId: string, updates: Partial<City>) => void;
  addEvent: (event: GameEvent) => void;
  advanceDate: (months?: number) => void;
  
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isLoading: false,
  error: null,
  
  setGameState: (state) => set({ gameState: state, error: null }),
  
  updateGameState: (partial) => set((state) => ({
    gameState: state.gameState ? { ...state.gameState, ...partial } : null
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  updateResources: (resources) => set((state) => {
    if (!state.gameState) return state;
    return {
      gameState: {
        ...state.gameState,
        player: {
          ...state.gameState.player,
          resources: {
            ...state.gameState.player.resources,
            ...resources
          }
        }
      }
    };
  }),
  
  updateHero: (heroId, updates) => set((state) => {
    if (!state.gameState) return state;
    return {
      gameState: {
        ...state.gameState,
        heroes: state.gameState.heroes.map(hero =>
          hero.id === heroId ? { ...hero, ...updates } : hero
        )
      }
    };
  }),
  
  updateCity: (cityId, updates) => set((state) => {
    if (!state.gameState) return state;
    return {
      gameState: {
        ...state.gameState,
        cities: state.gameState.cities.map(city =>
          city.id === cityId ? { ...city, ...updates } : city
        )
      }
    };
  }),
  
  addEvent: (event) => set((state) => {
    if (!state.gameState) return state;
    return {
      gameState: {
        ...state.gameState,
        activeEvents: [...state.gameState.activeEvents, event]
      }
    };
  }),
  
  advanceDate: (months = 1) => set((state) => {
    if (!state.gameState) return state;
    const newDate = { ...state.gameState.date };
    newDate.month += months;
    while (newDate.month > 12) {
      newDate.month -= 12;
      newDate.year += 1;
    }
    return {
      gameState: {
        ...state.gameState,
        date: newDate
      }
    };
  }),
  
  resetGame: () => set({ gameState: null, error: null })
}));
