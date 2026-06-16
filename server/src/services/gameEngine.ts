import { GameState, Resources, Hero, City, Faction } from '../types/game';
import { HEROES_DATA, CITIES_DATA, FACTIONS_DATA } from '../data/gameData';

export class GameEngine {
  private state: GameState | null = null;

  initializeGame(playerName: string, factionId: string, startYear: number = 184): GameState {
    const faction = FACTIONS_DATA.find(f => f.id === factionId);
    const initialResources: Resources = faction ? { ...faction.resources } : {
      grain: 5000,
      gold: 3000,
      population: 20000,
      wood: 2000,
      iron: 1000,
      cloth: 500,
      morale: 70
    };

    const heroes: Hero[] = HEROES_DATA.map(hero => ({
      id: hero.id,
      name: hero.name,
      courtesyName: hero.courtesyName,
      birthYear: hero.birthYear,
      deathYear: hero.deathYear,
      factionId: hero.factionId || (hero.id === factionId ? factionId : undefined),
      loyalty: hero.loyalty || 100,
      stats: { ...hero.stats },
      traits: [...hero.traits],
      personality: hero.personality,
      skills: [...hero.skills],
      status: 'idle',
      alive: true,
      level: 1,
      experience: 0,
      relationships: {}
    }));

    const cities: City[] = CITIES_DATA.map(city => ({
      id: city.id,
      name: city.name,
      level: city.level,
      factionId: city.factionId,
      population: city.population,
      prosperity: city.prosperity,
      security: city.security,
      morale: city.morale,
      resources: {
        grain: city.population * 0.1,
        gold: city.population * 0.05,
        population: city.population,
        wood: city.population * 0.03,
        iron: city.population * 0.02,
        cloth: city.population * 0.01,
        morale: city.morale
      },
      facilities: { ...city.facilities },
      position: { ...city.position },
      garrison: city.level * 2000
    }));

    const factions: Faction[] = FACTIONS_DATA.map(f => ({
      id: f.id,
      name: f.name,
      leaderId: f.leaderId,
      heroes: heroes.filter(h => h.factionId === f.id).map(h => h.id),
      cities: cities.filter(c => c.factionId === f.id).map(c => c.id),
      relationships: { ...f.relationships },
      personality: f.personality,
      resources: { ...f.resources }
    }));

    this.state = {
      player: {
        name: playerName,
        factionId: factionId,
        resources: { ...initialResources }
      },
      date: { year: startYear, month: 1 },
      factions,
      heroes,
      cities,
      activeEvents: [],
      history: [],
      settings: {
        apiBaseUrl: '',
        apiKey: '',
        model: 'gpt-4o'
      }
    };

    return this.state;
  }

  getState(): GameState | null {
    return this.state;
  }

  updateState(newState: Partial<GameState>) {
    if (this.state) {
      this.state = { ...this.state, ...newState };
    }
  }

  advanceDate(months: number = 1) {
    if (!this.state) return;
    
    this.state.date.month += months;
    while (this.state.date.month > 12) {
      this.state.date.month -= 12;
      this.state.date.year += 1;
    }
  }

  updateResources(resourceChanges: Partial<Resources>) {
    if (!this.state) return;
    
    for (const [key, value] of Object.entries(resourceChanges)) {
      if (key in this.state.player.resources) {
        (this.state.player.resources as any)[key] += value;
      }
    }
  }

  getHeroesByFaction(factionId: string): Hero[] {
    if (!this.state) return [];
    return this.state.heroes.filter(h => h.factionId === factionId);
  }

  getCitiesByFaction(factionId: string): City[] {
    if (!this.state) return [];
    return this.state.cities.filter(c => c.factionId === factionId);
  }

  getFaction(factionId: string): Faction | undefined {
    if (!this.state) return undefined;
    return this.state.factions.find(f => f.id === factionId);
  }

  addHeroToFaction(heroId: string, factionId: string) {
    if (!this.state) return;
    const hero = this.state.heroes.find(h => h.id === heroId);
    if (hero) {
      hero.factionId = factionId;
      hero.loyalty = 80;
    }
  }

  removeHeroFromFaction(heroId: string) {
    if (!this.state) return;
    const hero = this.state.heroes.find(h => h.id === heroId);
    if (hero) {
      hero.factionId = undefined;
      hero.loyalty = 50;
    }
  }

  captureCity(cityId: string, factionId: string) {
    if (!this.state) return;
    const city = this.state.cities.find(c => c.id === cityId);
    if (city) {
      city.factionId = factionId;
    }
  }
}

export const gameEngine = new GameEngine();
