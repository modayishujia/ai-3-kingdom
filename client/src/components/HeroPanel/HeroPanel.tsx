import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import gameApi from '../../services/gameApi';

interface Hero {
  id: string;
  name: string;
  courtesyName?: string;
  stats: {
    command: number;
    strength: number;
    intellect: number;
    politics: number;
    charisma: number;
  };
  traits: string[];
  personality: string;
  skills: string[];
  loyalty: number;
  level: number;
  experience: number;
}

const HeroPanel: React.FC = () => {
  const { gameState, setError } = useGameStore();
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [dialogueInput, setDialogueInput] = useState('');
  const [dialogueResponse, setDialogueResponse] = useState<string | null>(null);
  const [isDialoging, setIsDialoging] = useState(false);

  if (!gameState) return null;

  const playerHeroes = gameState.heroes.filter(h => h.factionId === gameState.player.factionId);

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero);
    setDialogueResponse(null);
    setDialogueInput('');
  };

  const handleDialogue = async () => {
    if (!selectedHero || !dialogueInput.trim() || isDialoging) return;

    setIsDialoging(true);
    try {
      const result = await gameApi.heroDialogue(selectedHero.id, dialogueInput.trim());
      if (result.success) {
        setDialogueResponse(result.response);
      }
    } catch (error: any) {
      setError(error.message || '对话失败');
    } finally {
      setIsDialoging(false);
    }
  };

  const getStatBar = (value: number, max: number = 100) => {
    const percentage = Math.min(100, (value / max) * 100);
    return (
      <div style={styles.statBar}>
        <div style={{ ...styles.statFill, width: `${percentage}%` }} />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>👤 武将面板</h3>
      
      {!selectedHero ? (
        <div style={styles.heroList}>
          {playerHeroes.map(hero => (
            <div
              key={hero.id}
              style={styles.heroCard}
              onClick={() => handleHeroClick(hero)}
            >
              <div style={styles.heroHeader}>
                <span style={styles.heroName}>{hero.name}</span>
                {hero.courtesyName && (
                  <span style={styles.heroCourtesy}>({hero.courtesyName})</span>
                )}
              </div>
              
              <div style={styles.heroStats}>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>武力</span>
                  {getStatBar(hero.stats.strength)}
                  <span style={styles.statValue}>{hero.stats.strength}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>智力</span>
                  {getStatBar(hero.stats.intellect)}
                  <span style={styles.statValue}>{hero.stats.intellect}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>统率</span>
                  {getStatBar(hero.stats.command)}
                  <span style={styles.statValue}>{hero.stats.command}</span>
                </div>
              </div>
              
              <div style={styles.heroTraits}>
                {hero.traits.slice(0, 3).map((trait, i) => (
                  <span key={i} style={styles.traitBadge}>{trait}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.heroDetail}>
          <div style={styles.detailHeader}>
            <h4 style={styles.detailName}>{selectedHero.name}</h4>
            {selectedHero.courtesyName && (
              <span style={styles.detailCourtesy}>字 {selectedHero.courtesyName}</span>
            )}
          </div>
          
          <div style={styles.detailStats}>
            <h5 style={styles.sectionTitle}>能力值</h5>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>武力</span>
                <span style={styles.statValue}>{selectedHero.stats.strength}</span>
                {getStatBar(selectedHero.stats.strength)}
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>智力</span>
                <span style={styles.statValue}>{selectedHero.stats.intellect}</span>
                {getStatBar(selectedHero.stats.intellect)}
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>统率</span>
                <span style={styles.statValue}>{selectedHero.stats.command}</span>
                {getStatBar(selectedHero.stats.command)}
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>政治</span>
                <span style={styles.statValue}>{selectedHero.stats.politics}</span>
                {getStatBar(selectedHero.stats.politics)}
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>魅力</span>
                <span style={styles.statValue}>{selectedHero.stats.charisma}</span>
                {getStatBar(selectedHero.stats.charisma)}
              </div>
            </div>
          </div>
          
          <div style={styles.detailTraits}>
            <h5 style={styles.sectionTitle}>特性</h5>
            <div style={styles.traitsList}>
              {selectedHero.traits.map((trait, i) => (
                <span key={i} style={styles.traitBadge}>{trait}</span>
              ))}
            </div>
          </div>
          
          <div style={styles.detailSkills}>
            <h5 style={styles.sectionTitle}>技能</h5>
            <div style={styles.skillsList}>
              {selectedHero.skills.map((skill, i) => (
                <span key={i} style={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </div>
          
          <div style={styles.dialogueSection}>
            <h5 style={styles.sectionTitle}>与{selectedHero.name}对话</h5>
            <div style={styles.dialogueInput}>
              <input
                type="text"
                value={dialogueInput}
                onChange={(e) => setDialogueInput(e.target.value)}
                placeholder={`对${selectedHero.name}说...`}
                style={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleDialogue()}
                disabled={isDialoging}
              />
              <button
                onClick={handleDialogue}
                disabled={isDialoging || !dialogueInput.trim()}
                style={styles.sendButton}
              >
                {isDialoging ? '...' : '对话'}
              </button>
            </div>
            
            {dialogueResponse && (
              <div style={styles.dialogueResponse}>
                <div style={styles.responseHeader}>
                  <span style={styles.responseName}>{selectedHero.name}：</span>
                </div>
                <p style={styles.responseText}>{dialogueResponse}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setSelectedHero(null)}
            style={styles.backButton}
          >
            返回列表
          </button>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  heroList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '400px',
    overflow: 'auto'
  },
  heroCard: {
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  heroHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px'
  },
  heroName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  heroCourtesy: {
    fontSize: '12px',
    color: '#666'
  },
  heroStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '8px'
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    width: '30px'
  },
  statBar: {
    flex: 1,
    height: '6px',
    background: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  statFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    borderRadius: '3px'
  },
  statValue: {
    fontSize: '12px',
    color: '#333',
    width: '25px',
    textAlign: 'right'
  },
  heroTraits: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap'
  },
  traitBadge: {
    padding: '2px 8px',
    background: '#e3f2fd',
    color: '#1976D2',
    borderRadius: '12px',
    fontSize: '11px'
  },
  heroDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailName: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  detailCourtesy: {
    fontSize: '14px',
    color: '#666'
  },
  sectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  detailStats: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px'
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  detailTraits: {},
  traitsList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  detailSkills: {},
  skillsList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  skillBadge: {
    padding: '4px 10px',
    background: '#fff3e0',
    color: '#E65100',
    borderRadius: '12px',
    fontSize: '12px'
  },
  dialogueSection: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px'
  },
  dialogueInput: {
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none'
  },
  sendButton: {
    padding: '8px 16px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  dialogueResponse: {
    marginTop: '12px',
    background: 'white',
    padding: '12px',
    borderRadius: '8px'
  },
  responseHeader: {
    marginBottom: '8px'
  },
  responseName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  responseText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#444'
  },
  backButton: {
    padding: '10px 16px',
    background: '#f0f0f0',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default HeroPanel;
