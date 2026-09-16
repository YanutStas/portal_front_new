// RobotAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, Avatar, Typography, Spin, theme } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import styles from './RobotAssistant.module.css';
import robotPng from '../../img/assistant.png'
import MarkDownText from '../MarkDownText/MarkDownText';

const { Text } = Typography;
const { TextArea } = Input;

// --- Генерация уникального Session ID ---
const generateUniqueId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для старых браузеров
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return generateUniqueId();

  const STORAGE_KEY = 'mosoblenergo_chat_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = generateUniqueId();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
};
// -----------------------------------------

const API_CONFIG = {
  baseUrl: 'https://n8n.mosoblenergo.ru/webhook/f2274c46-ee15-4d83-95fe-b37796dc871a',
};

// Компонент плавающей кнопки с роботом
export const RobotButton = ({ onClick, isVisible = true }) => {
  const { token } = theme.useToken()
  if (!isVisible) return null;

  return (
    <div className={styles.robotWidget} onClick={onClick}>
      <div className={styles.robotAvatarWrapper}>
        <div className={styles.robotPulse}></div>
        <Avatar
          shape='square'
          size={70}
          className={styles.robotAvatar}
          src={robotPng}
          alt="Помощник"
        />
      </div>
      <div className={styles.robotTextBubble} style={{ background: token.colorBgLayout }}>
        <Text type="secondary" className={styles.robotTextDesc}>
          Нужна помощь? Спросите у меня!
        </Text>
      </div>
    </div>
  );
};

// Компонент модального окна с чатом
export const RobotChatModal = ({ isOpen, onClose }) => {
  const { token } = theme.useToken()
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Здравствуйте! Я ваш виртуальный помощник МосОблЭнерго. Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  console.log(token);

  // Отправка сообщения на бэкенд
  const sendMessageToBackend = async (message, currentSessionId) => {
    const url = `${API_CONFIG.baseUrl}?message=${encodeURIComponent(message)}&sessionId=${currentSessionId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sessionId: currentSessionId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  // Обработка потокового ответа
  const handleStreamResponse = async (reader) => {
    const decoder = new TextDecoder();
    let fullMessage = '';
    const currentMessageId = Date.now() + 1;

    // Добавляем пустое сообщение бота
    setMessages(prev => [...prev, {
      id: currentMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true
    }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);

          if (data.type === 'item' && data.content) {
            fullMessage += data.content;

            setMessages(prev => prev.map(msg =>
              msg.id === currentMessageId
                ? { ...msg, text: fullMessage }
                : msg
            ));
          }
        } catch (e) {
          console.warn('Failed to parse JSON chunk:', e, line);
        }
      }
    }

    // Убираем флаг streaming
    setMessages(prev => prev.map(msg =>
      msg.id === currentMessageId
        ? { ...msg, isStreaming: false }
        : msg
    ));

    return fullMessage;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();

    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(userMessageText, sessionId);
      const reader = response.body.getReader();
      await handleStreamResponse(reader);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Извините, произошла ошибка соединения. Пожалуйста, попробуйте позже или позвоните нам: 8-800-550-00-00',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={<div className={styles.modalHeader} style={{ marginRight: 20 }}>
        <Avatar
          shape="square"
          size={50}
          src={robotPng}
          className={styles.modalAvatar}
        />
        <div className={styles.modalHeaderInfo}>
          <Text strong className={styles.modalTitle}>Помощник МосОблЭнерго</Text>
          <Text type="secondary" className={styles.modalStatus}>● Онлайн</Text>
        </div>
      </div>}
      closeIcon={<CloseOutlined />}
      className="robot-chat-modal"
      width={800}
      centered
    >


      <div className={styles.chatContainer}>
        <div className={styles.messagesWrapper}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.sender === 'bot' ? styles.messageBot : styles.messageUser}`}
              style={{ backgroundColor: message.sender === 'bot' ? token.colorPrimaryBg : token.colorPrimaryHover }}
            >
              <div className={styles.messageContent} style={{ color: message.sender === 'bot' ? token.colorTextBase : token.colorTextLightSolid, fontSize: 16, }}>
                {message.sender === 'bot' &&

                  <MarkDownText>
                    {message.text}
                  </MarkDownText>
                }
                {message.sender !== 'bot' &&
                  <span style={{ fontSize: 16, }}>{message.text}</span>
                }
                {message.isStreaming && <Spin size="small" style={{ marginLeft: 8 }} />}
              </div>
              <Text className={styles.messageTime} style={{ color: message.sender !== "bot" ? token.colorTextSecondary : undefined }}>
                {message.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.sender === 'user' && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <Spin size="small" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea} style={{ borderTop: `1px solid ${token.colorBorder}` }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите ваш вопрос..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={styles.chatInput}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined style={{ color: (!inputValue.trim() || isLoading)?token.colorTextDisabled:token.colorTextLightSolid, transform: "translate(1px, 1px)" }} />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

// Компонент-обертка
export const RobotAssistant = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <RobotButton
        onClick={() => setIsModalOpen(true)}
        isVisible={!isModalOpen}
      />
      <RobotChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default RobotAssistant;