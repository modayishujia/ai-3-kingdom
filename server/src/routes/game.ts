import { Router, Request, Response } from 'express';
import { gameEngine } from '../services/gameEngine';
import { aiService } from '../services/aiService';

const router = Router();

router.post('/configure', (req: Request, res: Response) => {
  const { baseUrl, apiKey, model } = req.body;
  
  if (!baseUrl || !apiKey || !model) {
    return res.status(400).json({ error: 'Missing required fields: baseUrl, apiKey, model' });
  }
  
  aiService.configure(baseUrl, apiKey, model);
  res.json({ success: true, message: 'AI service configured' });
});

router.post('/new-game', (req: Request, res: Response) => {
  const { playerName, factionId, startYear } = req.body;
  
  if (!playerName || !factionId) {
    return res.status(400).json({ error: 'Missing required fields: playerName, factionId' });
  }
  
  const gameState = gameEngine.initializeGame(playerName, factionId, startYear || 184);
  res.json({ success: true, gameState });
});

router.get('/state', (req: Request, res: Response) => {
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(404).json({ error: 'No game in progress' });
  }
  
  res.json({ success: true, state });
});

router.post('/save', (req: Request, res: Response) => {
  const state = gameEngine.getState();
  
  if (!state) {
    return res.status(404).json({ error: 'No game in progress' });
  }
  
  const saveData = {
    gameState: state,
    version: '1.0.0',
    timestamp: Date.now()
  };
  
  res.json({ success: true, saveData });
});

router.post('/load', (req: Request, res: Response) => {
  const { saveData } = req.body;
  
  if (!saveData || !saveData.gameState) {
    return res.status(400).json({ error: 'Invalid save data' });
  }
  
  gameEngine.updateState(saveData.gameState);
  res.json({ success: true, state: gameEngine.getState() });
});

router.get('/status', (req: Request, res: Response) => {
  const state = gameEngine.getState();
  const aiConfigured = aiService.isConfigured();
  
  res.json({
    success: true,
    hasGame: state !== null,
    aiConfigured,
    date: state?.date
  });
});

export default router;
