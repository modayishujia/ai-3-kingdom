import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService';
import { gameEngine } from '../services/gameEngine';

const router = Router();

router.post('/simulate', async (req: Request, res: Response) => {
  const { attacker, defender, location } = req.body;
  
  if (!attacker || !defender) {
    return res.status(400).json({ error: 'attacker and defender are required' });
  }
  
  if (!aiService.isConfigured()) {
    return res.status(400).json({ error: 'AI service not configured' });
  }
  
  try {
    const battlePrompt = `你是三国时期的军事模拟器。根据以下条件模拟一场战斗：

【进攻方】
势力: ${attacker.faction}
将领: ${attacker.heroes?.join('、') || '无'}
兵力: ${attacker.troops}
兵种: ${attacker.unitTypes?.join('、') || '步兵'}

【防守方】
势力: ${defender.faction}
将领: ${defender.heroes?.join('、') || '无'}
兵力: ${defender.troops}
兵种: ${defender.unitTypes?.join('、') || '步兵'}

【战场】
地点: ${location || '中原'}
地形: ${req.body.terrain || '平原'}
天气: ${req.body.weather || '晴朗'}

【要求】
1. 战斗过程要符合历史逻辑
2. 武将特性影响战斗
3. 地形和天气有影响
4. 输出详细战报

【输出格式】
{
  "winner": "胜利方",
  "attacker_losses": 进攻方伤亡,
  "defender_losses": 防守方伤亡,
  "prisoners": 俘虏数,
  "key_moments": ["关键时刻1", "关键时刻2"],
  "report": "详细战报文本",
  "aftermath": "战后影响"
}`;

    const messages = [
      { role: 'system', content: '你是一位公正的军事模拟器，擅长模拟古代战争。' },
      { role: 'user', content: battlePrompt }
    ];
    
    const response = await aiService.chatWithJson(messages);
    
    res.json({ success: true, battle: response });
  } catch (error: any) {
    console.error('Battle simulation error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate battle' });
  }
});

router.post('/siege', async (req: Request, res: Response) => {
  const { attacker, defenderCity } = req.body;
  
  if (!attacker || !defenderCity) {
    return res.status(400).json({ error: 'attacker and defenderCity are required' });
  }
  
  if (!aiService.isConfigured()) {
    return res.status(400).json({ error: 'AI service not configured' });
  }
  
  try {
    const siegePrompt = `你是三国时期的攻城战模拟器。根据以下条件模拟一场攻城战：

【进攻方】
势力: ${attacker.faction}
将领: ${attacker.heroes?.join('、') || '无'}
兵力: ${attacker.troops}
攻城器械: ${attacker.siegeWeapons || '无'}

【防守方】
城池: ${defenderCity.name}
城池等级: ${defenderCity.level}
守军: ${defenderCity.garrison}
守将: ${defenderCity.defenders?.join('、') || '无'}
城墙防御: ${defenderCity.wallDefense || 10000}

【要求】
1. 攻城战要符合历史逻辑
2. 城墙、攻城器械有影响
3. 守将能力影响防守
4. 输出详细战报

【输出格式】
{
  "winner": "胜利方",
  "attacker_losses": 进攻方伤亡,
  "defender_losses": 防守方伤亡,
  "wall_damage": 城墙损伤,
  "key_moments": ["关键时刻1", "关键时刻2"],
  "report": "详细战报文本",
  "city_captured": 是否攻占城池
}`;

    const messages = [
      { role: 'system', content: '你是一位公正的军事模拟器，擅长模拟古代攻城战。' },
      { role: 'user', content: siegePrompt }
    ];
    
    const response = await aiService.chatWithJson(messages);
    
    res.json({ success: true, siege: response });
  } catch (error: any) {
    console.error('Siege simulation error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate siege' });
  }
});

export default router;
