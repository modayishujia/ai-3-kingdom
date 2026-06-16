import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const StatusBar: React.FC = () => {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  const { player, date } = gameState;
  const resources = player.resources;

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <span style={styles.label}>📅 时间</span>
        <span style={styles.value}>{date.year}年{date.month}月</span>
      </div>
      
      <div style={styles.divider}></div>
      
      <div style={styles.section}>
        <span style={styles.label}>🏯 势力</span>
        <span style={styles.value}>{player.factionId}</span>
      </div>
      
      <div style={styles.divider}></div>
      
      <div style={styles.resources}>
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>🌾</span>
          <span style={styles.resourceValue}>{resources.grain.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>💰</span>
          <span style={styles.resourceValue}>{resources.gold.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>👥</span>
          <span style={styles.resourceValue}>{resources.population.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>🪵</span>
          <span style={styles.resourceValue}>{resources.wood.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>⛏️</span>
          <span style={styles.resourceValue}>{resources.iron.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>🧵</span>
          <span style={styles.resourceValue}>{resources.cloth.toLocaleString()}</span>
        </div>
        
        <div style={styles.resource}>
          <span style={styles.resourceIcon}>❤️</span>
          <span style={styles.resourceValue}>{resources.morale}</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  label: {
    fontSize: '12px',
    color: '#aaa'
  },
  value: {
    fontSize: '14px',
    fontWeight: '600'
  },
  divider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255, 255, 255, 0.2)'
  },
  resources: {
    display: 'flex',
    gap: '16px',
    marginLeft: 'auto'
  },
  resource: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  resourceIcon: {
    fontSize: '14px'
  },
  resourceValue: {
    fontSize: '13px',
    fontWeight: '500'
  }
};

export default StatusBar;
