import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import gameApi from '../../services/gameApi';

interface Event {
  id: string;
  name: string;
  description: string;
  narrative?: string;
  choices?: EventChoice[];
}

interface EventChoice {
  id: string;
  text: string;
  description: string;
  effects?: { description: string }[];
}

const EventCard: React.FC = () => {
  const { gameState, setLoading, setError } = useGameStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventResult, setEventResult] = useState<string[] | null>(null);

  useEffect(() => {
    loadEvents();
  }, [gameState?.date]);

  const loadEvents = async () => {
    try {
      const result = await gameApi.getAvailableEvents();
      if (result.success) {
        setEvents(result.events);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleEventClick = async (eventId: string) => {
    try {
      setLoading(true);
      const result = await gameApi.getEventDetail(eventId);
      if (result.success) {
        setSelectedEvent(result.event);
        setEventResult(null);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (eventId: string, choiceId: string) => {
    try {
      setLoading(true);
      const result = await gameApi.chooseEvent(eventId, choiceId);
      if (result.success) {
        setEventResult(result.effects);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to process choice');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setEventResult(null);
    loadEvents();
  };

  if (events.length === 0 && !selectedEvent) {
    return null;
  }

  return (
    <div style={styles.container}>
      {!selectedEvent ? (
        <>
          <h3 style={styles.title}>📜 历史事件</h3>
          <div style={styles.eventList}>
            {events.map(event => (
              <div
                key={event.id}
                style={styles.eventItem}
                onClick={() => handleEventClick(event.id)}
              >
                <span style={styles.eventName}>{event.name}</span>
                <span style={styles.eventDate}>{event.date.year}年{event.date.month}月</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.eventDetail}>
          <h3 style={styles.title}>{selectedEvent.name}</h3>
          <p style={styles.description}>{selectedEvent.description}</p>
          
          {selectedEvent.narrative && (
            <div style={styles.narrative}>
              {selectedEvent.narrative.split('\n').map((line, i) => (
                <p key={i} style={styles.paragraph}>{line}</p>
              ))}
            </div>
          )}
          
          {eventResult ? (
            <div style={styles.result}>
              <h4 style={styles.resultTitle}>结果</h4>
              {eventResult.map((effect, i) => (
                <p key={i} style={styles.effect}>• {effect}</p>
              ))}
              <button onClick={handleClose} style={styles.closeButton}>
                关闭
              </button>
            </div>
          ) : selectedEvent.choices ? (
            <div style={styles.choices}>
              <h4 style={styles.choicesTitle}>你的选择</h4>
              {selectedEvent.choices.map(choice => (
                <div
                  key={choice.id}
                  style={styles.choiceItem}
                  onClick={() => handleChoice(selectedEvent.id, choice.id)}
                >
                  <span style={styles.choiceText}>{choice.text}</span>
                  {choice.description && (
                    <span style={styles.choiceDesc}>{choice.description}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          
          {!eventResult && (
            <button onClick={handleClose} style={styles.backButton}>
              返回
            </button>
          )}
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
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  eventItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  eventName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  eventDate: {
    fontSize: '12px',
    color: '#666'
  },
  eventDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  narrative: {
    background: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    maxHeight: '200px',
    overflow: 'auto'
  },
  paragraph: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  choicesTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  choiceItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    background: '#f0f7ff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  choiceText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  choiceDesc: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  },
  result: {
    background: '#f0fff0',
    padding: '12px',
    borderRadius: '8px'
  },
  resultTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  effect: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    color: '#444'
  },
  closeButton: {
    marginTop: '12px',
    padding: '8px 16px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  backButton: {
    marginTop: '8px',
    padding: '8px 16px',
    background: '#f0f0f0',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default EventCard;
