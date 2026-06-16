import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const gameApi = {
  configureAI: async (baseUrl: string, apiKey: string, model: string) => {
    const response = await api.post('/game/configure', { baseUrl, apiKey, model });
    return response.data;
  },
  
  newGame: async (playerName: string, factionId: string, startYear?: number) => {
    const response = await api.post('/game/new-game', { playerName, factionId, startYear });
    return response.data;
  },
  
  getState: async () => {
    const response = await api.get('/game/state');
    return response.data;
  },
  
  saveGame: async () => {
    const response = await api.post('/game/save');
    return response.data;
  },
  
  loadGame: async (saveData: any) => {
    const response = await api.post('/game/load', { saveData });
    return response.data;
  },
  
  getStatus: async () => {
    const response = await api.get('/game/status');
    return response.data;
  },
  
  sendChat: async (message: string) => {
    const response = await api.post('/chat/send', { message });
    return response.data;
  },
  
  heroDialogue: async (heroId: string, message: string) => {
    const response = await api.post('/chat/hero-dialogue', { heroId, message });
    return response.data;
  },
  
  simulateBattle: async (attacker: any, defender: any, location?: string, terrain?: string, weather?: string) => {
    const response = await api.post('/battle/simulate', { attacker, defender, location, terrain, weather });
    return response.data;
  },
  
  simulateSiege: async (attacker: any, defenderCity: any) => {
    const response = await api.post('/battle/siege', { attacker, defenderCity });
    return response.data;
  },
  
  getAvailableEvents: async () => {
    const response = await api.get('/events/available');
    return response.data;
  },
  
  getEventDetail: async (eventId: string) => {
    const response = await api.get(`/events/detail/${eventId}`);
    return response.data;
  },
  
  chooseEvent: async (eventId: string, choiceId: string) => {
    const response = await api.post('/events/choose', { eventId, choiceId });
    return response.data;
  },
  
  generateEvent: async () => {
    const response = await api.post('/events/generate');
    return response.data;
  }
};

export default gameApi;
