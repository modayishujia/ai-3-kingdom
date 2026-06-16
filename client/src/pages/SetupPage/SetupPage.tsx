import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import gameApi from '../../services/gameApi';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setGameState, setLoading, setError } = useGameStore();
  
  const [step, setStep] = useState<'api' | 'game'>('api');
  const [apiConfig, setApiConfig] = useState({
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o'
  });
  const [gameConfig, setGameConfig] = useState({
    playerName: '',
    factionId: 'liubei',
    startYear: 184
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleConfigureAI = async () => {
    if (!apiConfig.apiKey) {
      setError('请输入API Key');
      return;
    }
    
    setIsConfiguring(true);
    try {
      await gameApi.configureAI(apiConfig.baseUrl, apiConfig.apiKey, apiConfig.model);
      setStep('game');
    } catch (error: any) {
      setError(error.response?.data?.error || '配置AI失败');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleStartGame = async () => {
    if (!gameConfig.playerName) {
      setError('请输入玩家名称');
      return;
    }
    
    setIsStarting(true);
    try {
      const result = await gameApi.newGame(
        gameConfig.playerName,
        gameConfig.factionId,
        gameConfig.startYear
      );
      
      if (result.success) {
        setGameState(result.gameState);
        navigate('/game');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || '开始游戏失败');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏯 AI 三国</h1>
        <p style={styles.subtitle}>AI驱动的三国策略游戏</p>
        
        {step === 'api' ? (
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>📡 API配置</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>API Base URL</label>
              <input
                type="text"
                value={apiConfig.baseUrl}
                onChange={(e) => setApiConfig({ ...apiConfig, baseUrl: e.target.value })}
                style={styles.input}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>API Key</label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                style={styles.input}
                placeholder="sk-..."
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>模型</label>
              <select
                value={apiConfig.model}
                onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })}
                style={styles.select}
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            
            <button
              onClick={handleConfigureAI}
              disabled={isConfiguring}
              style={styles.button}
            >
              {isConfiguring ? '配置中...' : '下一步'}
            </button>
          </div>
        ) : (
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>🎮 游戏设置</h2>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>你的名字</label>
              <input
                type="text"
                value={gameConfig.playerName}
                onChange={(e) => setGameConfig({ ...gameConfig, playerName: e.target.value })}
                style={styles.input}
                placeholder="输入你的名字"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>选择势力</label>
              <select
                value={gameConfig.factionId}
                onChange={(e) => setGameConfig({ ...gameConfig, factionId: e.target.value })}
                style={styles.select}
              >
                <option value="liubei">蜀汉 - 刘备</option>
                <option value="caocao">曹魏 - 曹操</option>
                <option value="sunquan">东吴 - 孙权</option>
                <option value="yuan_shao">袁绍</option>
                <option value="lvbu">吕布</option>
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>起始年份</label>
              <select
                value={gameConfig.startYear}
                onChange={(e) => setGameConfig({ ...gameConfig, startYear: parseInt(e.target.value) })}
                style={styles.select}
              >
                <option value={184}>184年 - 黄巾之乱</option>
                <option value={189}>189年 - 董卓乱政</option>
                <option value={190}>190年 - 群雄割据</option>
                <option value={200}>200年 - 官渡之战</option>
                <option value={208}>208年 - 赤壁之战</option>
              </select>
            </div>
            
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setStep('api')}
                style={styles.secondaryButton}
              >
                返回
              </button>
              <button
                onClick={handleStartGame}
                disabled={isStarting}
                style={styles.primaryButton}
              >
                {isStarting ? '创建中...' : '开始游戏'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '20px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 8px 0',
    color: '#1a1a2e'
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#666',
    margin: '0 0 32px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#333'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#444'
  },
  input: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  select: {
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    background: 'white',
    cursor: 'pointer'
  },
  button: {
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '8px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  primaryButton: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  secondaryButton: {
    flex: 1,
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default SetupPage;
