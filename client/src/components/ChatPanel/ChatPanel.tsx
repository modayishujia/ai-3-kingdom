import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import gameApi from '../../services/gameApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  choices?: { id: string; text: string; consequenceHint?: string }[];
  timestamp: Date;
}

const ChatPanel: React.FC = () => {
  const { gameState, isLoading, setLoading, setError } = useGameStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (gameState && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `欢迎来到AI三国！\n\n当前时间：${gameState.date.year}年${gameState.date.month}月\n你所在的势力：${gameState.player.factionId}\n\n你可以输入任何指令，AI会根据你的选择推动剧情发展。`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [gameState]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await gameApi.sendChat(input.trim());
      
      if (result.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.response.narrative || 'AI正在思考...',
          choices: result.response.choices,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || '发送消息失败');
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，AI暂时无法回应，请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceClick = async (choiceId: string, choiceText: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `选择：${choiceText}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await gameApi.sendChat(`我选择了：${choiceText}`);
      
      if (result.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.response.narrative || 'AI正在处理你的选择...',
          choices: result.response.choices,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || '处理选择失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💬 剧情对话</h2>
        <span style={styles.date}>
          {gameState?.date.year}年{gameState?.date.month}月
        </span>
      </div>
      
      <div style={styles.messages}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              ...(message.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}
          >
            <div style={styles.messageContent}>
              {message.content.split('\n').map((line, i) => (
                <p key={i} style={styles.paragraph}>{line}</p>
              ))}
            </div>
            
            {message.choices && message.choices.length > 0 && (
              <div style={styles.choices}>
                {message.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice.id, choice.text)}
                    style={styles.choiceButton}
                  >
                    {choice.text}
                    {choice.consequenceHint && (
                      <span style={styles.hint}>{choice.consequenceHint}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ ...styles.message, ...styles.assistantMessage }}>
            <div style={styles.typing}>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
              <span style={styles.dot}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的指令..."
          style={styles.input}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={styles.sendButton}
        >
          发送
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#f8f9fa'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'white',
    borderBottom: '1px solid #e0e0e0'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  date: {
    fontSize: '14px',
    color: '#666',
    background: '#f0f0f0',
    padding: '4px 12px',
    borderRadius: '12px'
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
    lineHeight: '1.6'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    background: 'white',
    color: '#333',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: '4px'
  },
  messageContent: {
    whiteSpace: 'pre-wrap'
  },
  paragraph: {
    margin: '0 0 8px 0'
  },
  choices: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  choiceButton: {
    padding: '10px 16px',
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontSize: '14px'
  },
  hint: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginTop: '4px'
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0'
  },
  dot: {
    width: '8px',
    height: '8px',
    background: '#ccc',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out'
  },
  inputArea: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    background: 'white',
    borderTop: '1px solid #e0e0e0'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none'
  },
  sendButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default ChatPanel;
