import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import ChatPanel from '../../components/ChatPanel/ChatPanel';
import StatusBar from '../../components/StatusBar/StatusBar';
import EventCard from '../../components/EventCard/EventCard';
import HeroPanel from '../../components/HeroPanel/HeroPanel';

const MainPage: React.FC = () => {
  const { gameState } = useGameStore();

  if (!gameState) {
    return (
      <div style={styles.loading}>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <StatusBar />
      
      <div style={styles.main}>
        <div style={styles.chatSection}>
          <ChatPanel />
        </div>
        
        <div style={styles.infoSection}>
          <EventCard />
          <HeroPanel />
          
          <div style={styles.infoPanel}>
            <h3 style={styles.panelTitle}>📊 势力状态</h3>
            <div style={styles.panelContent}>
              <p>城池数量: {gameState.cities.filter(c => c.factionId === gameState.player.factionId).length}</p>
              <p>武将数量: {gameState.heroes.filter(h => h.factionId === gameState.player.factionId).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#f0f2f5'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f0f2f5'
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  chatSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e0e0e0'
  },
  infoSection: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    overflow: 'auto',
    background: '#f8f9fa'
  },
  infoPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  panelTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  heroItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: '#f8f9fa',
    borderRadius: '6px'
  },
  heroName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  heroStats: {
    fontSize: '12px',
    color: '#666'
  },
  cityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    background: '#f8f9fa',
    borderRadius: '6px'
  },
  cityName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  cityLevel: {
    fontSize: '12px',
    color: '#666'
  }
};

export default MainPage;
