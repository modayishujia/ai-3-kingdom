import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { gameEngine } from '../services/gameEngine';

const router = Router();

const SYSTEM_PROMPT = `你是《AI三国》的游戏AI，负责驱动游戏的各个方面。

【角色】
你是一位历史编剧和游戏主持人，负责：
1. 讲述历史剧情
2. 模拟武将对话
3. 描述战争场面
4. 处理玩家选择

【原则】
1. 历史准确性：主要事件遵循真实历史
2. 人物性格：武将对话要符合其性格
3. 戏剧性：让故事引人入胜
4. 选择重要性：玩家选择要有明确后果

【输出格式】
始终输出合法JSON，格式为：
{
  "narrative": "剧情描述文本",
  "dialogue": [{"speaker": "武将名", "text": "对话内容"}],
  "effects": {"resources": {}, "relationships": {}, "events": []},
  "choices": [{"id": "选项ID", "text": "选项描述", "consequence_hint": "暗示"}],
  "next_date": {"year": 年份, "month": 月份}
}

【当前游戏状态】
游戏时间：{date}
玩家势力：{faction}
玩家资源：{resources}
当前武将：{heroes}
当前城池：{cities}`;

router.post('/send', async (req: Request, res: Response) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (!aiService.isConfigured()) {
    return res.status(400).json({ error: 'AI service not configured' });
  }
  
  const state = gameEngine.getState();
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  try {
    const systemPrompt = SYSTEM_PROMPT
      .replace('{date}', `${state.date.year}年${state.date.month}月`)
      .replace('{faction}', state.player.factionId)
      .replace('{resources}', JSON.stringify(state.player.resources))
      .replace('{heroes}', state.heroes.filter(h => h.factionId === state.player.factionId).map(h => h.name).join('、'))
      .replace('{cities}', state.cities.filter(c => c.factionId === state.player.factionId).map(c => c.name).join('、'));
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];
    
    const response = await aiService.chatWithJson(messages);
    
    res.json({ success: true, response });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to get AI response' });
  }
});

router.post('/hero-dialogue', async (req: Request, res: Response) => {
  const { heroId, message } = req.body;
  
  if (!heroId || !message) {
    return res.status(400).json({ error: 'heroId and message are required' });
  }
  
  if (!aiService.isConfigured()) {
    return res.status(400).json({ error: 'AI service not configured' });
  }
  
  const state = gameEngine.getState();
  if (!state) {
    return res.status(400).json({ error: 'No game in progress' });
  }
  
  const hero = state.heroes.find(h => h.id === heroId);
  if (!hero) {
    return res.status(404).json({ error: 'Hero not found' });
  }
  
  try {
    const heroPrompt = `你是${hero.name}（字${hero.courtesyName || ''}），三国时期的人物。

【人物设定】
- 性格: ${hero.personality}
- 特性: ${hero.traits.join('、')}
- 当前状态: ${hero.status}

【对话要求】
1. 保持人物性格一致性
2. 使用符合时代的语言
3. 回应要简洁有力

请以${hero.name}的口吻回应：`;
    
    const messages = [
      { role: 'system', content: heroPrompt },
      { role: 'user', content: message }
    ];
    
    const response = await aiService.chat(messages);
    
    res.json({ success: true, response, hero: { id: hero.id, name: hero.name } });
  } catch (error: any) {
    console.error('Hero dialogue error:', error);
    res.status(500).json({ error: error.message || 'Failed to get hero dialogue' });
  }
});

export default router;
