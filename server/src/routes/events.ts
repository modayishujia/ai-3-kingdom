import { Router, Request, Response } from 'express';
import { gameEngine } from '../services/gameEngine';
import { aiService } from '../services/aiService';
import { getAvailableEvents, HistoricalEvent } from '../data/historicalEvents';

const router = Router();

const completedEvents: string[] = [];

router.get('/available', (req: Request, res: Response) => {
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  const availableEvents = getAvailableEvents(state, completedEvents);
  
  res.json({
    success: true,
    events: availableEvents.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      date: e.date
    }))
  });
});

router.get('/detail/:eventId', (req: Request, res: Response) => {
  const { eventId } = req.params;
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  const availableEvents = getAvailableEvents(state, completedEvents);
  const event = availableEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  res.json({
    success: true,
    event
  });
});

router.post('/choose', (req: Request, res: Response) => {
  const { eventId, choiceId } = req.body;
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  const availableEvents = getAvailableEvents(state, completedEvents);
  const event = availableEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const choice = event.choices.find(c => c.id === choiceId);
  
  if (!choice) {
    return res.status(404).json({ error: 'Choice not found' });
  }
  
  completedEvents.push(eventId);
  
  const effects = choice.effects.map(effect => {
    switch (effect.type) {
      case 'resource_change':
        const resourceKey = effect.target as keyof typeof state.player.resources;
        if (resourceKey in state.player.resources) {
          state.player.resources[resourceKey] += effect.value as number;
        }
        return effect.description;
      
      case 'relation_change':
        return effect.description;
      
      case 'hero_join':
        const hero = state.heroes.find(h => h.id === effect.target);
        if (hero) {
          hero.factionId = state.player.factionId;
          hero.loyalty = 90;
        }
        return effect.description;
      
      case 'morale_change':
        state.player.resources.morale += effect.value as number;
        return effect.description;
      
      default:
        return effect.description;
    }
  });
  
  res.json({
    success: true,
    effects,
    narrative: event.narrative
  });
});

router.post('/generate', async (req: Request, res: Response) => {
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  if (!aiService.isConfigured()) {
    return res.status(400).json({ error: 'AI service not configured' });
  }
  
  try {
    const prompt = `你是《AI三国》的事件生成AI。根据当前形势生成一个历史事件。

当前时间：${state.date.year}年${state.date.month}月
玩家势力：${state.player.factionId}
玩家城池：${state.cities.filter(c => c.factionId === state.player.factionId).map(c => c.name).join('、')}
玩家武将：${state.heroes.filter(h => h.factionId === state.player.factionId).map(h => h.name).join('、')}

请生成一个符合历史背景的事件，包含：
1. 事件标题
2. 事件描述
3. 详细剧情（2-3段）
4. 2-4个选择，每个选择有明确的后果

输出JSON格式：
{
  "id": "event_001",
  "name": "事件标题",
  "description": "简短描述",
  "narrative": "详细剧情",
  "choices": [
    {
      "id": "choice_1",
      "text": "选项文本",
      "description": "选项说明",
      "effects": [
        {
          "type": "effect_type",
          "target": "target",
          "value": "value",
          "description": "效果描述"
        }
      ]
    }
  ]
}`;

    const response = await aiService.chatWithJson([
      { role: 'system', content: '你是一位历史编剧，擅长创作三国时期的故事。' },
      { role: 'user', content: prompt }
    ]);
    
    res.json({
      success: true,
      event: response
    });
  } catch (error: any) {
    console.error('Event generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate event' });
  }
});

export default router;
