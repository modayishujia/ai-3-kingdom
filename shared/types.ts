export interface GameDate {
  year: number;
  month: number;
}

export interface Resources {
  grain: number;
  gold: number;
  population: number;
  wood: number;
  iron: number;
  cloth: number;
  morale: number;
}

export interface HeroStats {
  command: number;
  strength: number;
  intellect: number;
  politics: number;
  charisma: number;
}

export interface Hero {
  id: string;
  name: string;
  courtesyName?: string;
  birthYear: number;
  deathYear?: number;
  factionId?: string;
  loyalty: number;
  stats: HeroStats;
  traits: string[];
  personality: string;
  skills: string[];
  status: string;
  alive: boolean;
  level: number;
  experience: number;
  relationships: Record<string, Relationship>;
}

export interface Relationship {
  targetId: string;
  type: string;
  value: number;
}

export interface City {
  id: string;
  name: string;
  level: number;
  factionId?: string;
  population: number;
  prosperity: number;
  security: number;
  morale: number;
  resources: Resources;
  facilities: CityFacilities;
  position: { x: number; y: number };
  garrison: number;
}

export interface CityFacilities {
  farm: number;
  market: number;
  lumbermill: number;
  mine: number;
  workshop: number;
  harbor: number;
  temple: number;
}

export interface Faction {
  id: string;
  name: string;
  leaderId: string;
  heroes: string[];
  cities: string[];
  relationships: Record<string, number>;
  personality: string;
  resources: Resources;
}

export interface GameState {
  player: Player;
  date: GameDate;
  factions: Faction[];
  heroes: Hero[];
  cities: City[];
  activeEvents: GameEvent[];
  history: HistoryLog[];
  settings: GameSettings;
}

export interface Player {
  name: string;
  factionId: string;
  resources: Resources;
}

export interface GameSettings {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
}

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  narrative: string;
  choices: EventChoice[];
  effects: EventEffect[];
  date: GameDate;
  aiGenerated: boolean;
  priority: number;
}

export interface EventChoice {
  id: string;
  text: string;
  description?: string;
  effects: EventEffect[];
}

export interface EventEffect {
  type: string;
  target: string;
  value: any;
  description: string;
}

export interface HistoryLog {
  date: GameDate;
  type: string;
  description: string;
}

export interface AIResponse {
  narrative: string;
  dialogue: DialogueLine[];
  effects: GameEffects;
  choices: AIChoice[];
  nextDate: GameDate;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface GameEffects {
  resources?: Partial<Resources>;
  relationships?: Record<string, number>;
  events?: string[];
}

export interface AIChoice {
  id: string;
  text: string;
  consequenceHint?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BattleUnit {
  id: string;
  type: string;
  count: number;
  position: { x: number; y: number };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  factionId: string;
  heroId?: string;
}
