// ChatUI.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Space, Spin, Typography, Flex } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Markdown from 'markdown-to-jsx';
import { useN8nStream } from '../hooks/useN8nStream';

const { Text } = Typography;

const markdownOptions = {
    overrides: {
        p: { component: 'p', props: { style: { margin: '8px 0' } } },
        ul: { component: 'ul', props: { style: { paddingLeft: '20px' } } },
    },
};

export default function ChatUI() {
    const [input, setInput] = useState('');
    const { messages, sendMessage, isLoading } = useN8nStream();

    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    // 🔁 Надёжная прокрутка вниз после любого изменения контента
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        // Используем requestAnimationFrame + setTimeout для гарантии после рендера
        const scrollDown = () => {
            container.scrollTop = container.scrollHeight;
        };

        // Сначала дожидаемся завершения рендера
        requestAnimationFrame(() => {
            // Иногда нужно ещё чуть подождать (особенно при быстром стриме)
            setTimeout(scrollDown, 0);
        });
    }, [messages, isLoading]); // ← Зависимость: любое изменение чата

    // Фокус на input после завершения
    useEffect(() => {
        if (!isLoading && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isLoading]);
    
    let sessionId = false
    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;
        if (!(sessionId = localStorage.getItem('sessionId'))) {
            sessionId = crypto.randomUUID()
            localStorage.setItem('sessionId', sessionId)
        }
        sendMessage(input, sessionId);
        setInput('');
    };

    return (
        <Flex vertical style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
            {/* 💡 Контейнер чата — фиксированная высота + прокрутка */}
            <div
                ref={chatContainerRef}
                style={{
                    height: 500,
                    overflowY: 'auto',        // ← обязательно!
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box',  // ← чтобы padding не увеличивал высоту
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                maxWidth: '85%',
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: msg.role === 'user' ? '#e6f7ff' : '#ffffff',
                                boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                                wordBreak: 'break-word',
                            }}
                        >
                            <Markdown options={markdownOptions}>
                                {msg.text}
                            </Markdown>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ textAlign: 'left', marginBottom: 16 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: 12,
                                borderRadius: 12,
                                backgroundColor: '#ffffff',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Spin size="small" />
                            <Text type="secondary">AI печатает...</Text>
                        </div>
                    </div>
                )}
            </div>

            <Space.Compact style={{ width: '100%' }}>
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    placeholder="Введите ваш вопрос..."
                    disabled={isLoading}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                >
                    Отправить
                </Button>
            </Space.Compact>
        </Flex>
    );
}