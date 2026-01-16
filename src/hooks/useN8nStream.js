// hooks/useN8nAgentStream.js
import { useState, useCallback } from 'react';

export const useN8nStream = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (messageText, sessionId) => {
        const userMessage = { id: Date.now(), text: messageText, role: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();

        try {
            // const response = await fetch('https://n8n.mosoblenergo.ru/webhook/f2274c46-ee15-4d83-95fe-b37796dc871a', {
                const response = await fetch('https://n8n.mosoblenergo.ru/webhook/dcb1d216-fd9b-4bf7-828f-ddc58290803d', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    sessionId: sessionId,
                }),
                signal: controller.signal,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            if (!response.body) throw new Error('No stream body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let aiMessageId = Date.now() + 1;
            let fullText = '';

            // Добавляем пустое сообщение AI
            setMessages(prev => [...prev, { id: aiMessageId, text: '', role: 'assistant' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Обрабатываем буфер: разбиваем по границам JSON-объектов
                // Предполагаем, что объекты разделены пробелами или переносами
                // Внутри цикла чтения стрима
                let start = 0;
                while (true) {
                    const openBrace = buffer.indexOf('{', start);
                    if (openBrace === -1) break;

                    let depth = 0;
                    let i = openBrace;
                    // Находим конец корректного JSON-объекта (учитываем вложенные {})
                    for (; i < buffer.length; i++) {
                        if (buffer[i] === '{') depth++;
                        else if (buffer[i] === '}') depth--;
                        if (depth === 0) {
                            try {
                                const jsonStr = buffer.slice(openBrace, i + 1);
                                const event = JSON.parse(jsonStr);

                                if (event.type === 'item' && typeof event.content === 'string') {
                                    fullText += event.content;
                                    setMessages(prev =>
                                        prev.map(msg =>
                                            msg.id === aiMessageId ? { ...msg, text: fullText } : msg
                                        )
                                    );
                                }

                                // Обрезаем буфер
                                buffer = buffer.slice(i + 1).trimStart();
                                start = 0;
                                break;
                            } catch (e) {
                                // Невалидный JSON — продолжаем поиск
                                start = openBrace + 1;
                                break;
                            }
                        }
                    }
                    if (depth > 0) break; // Неполный объект — ждём следующих данных
                }
            }

            setIsLoading(false);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Stream error:', err);
                setError(err.message || 'Ошибка при получении ответа');
                setIsLoading(false);
            }
        }

        return () => controller.abort();
    }, []);

    return { messages, sendMessage, isLoading, error, clearMessages: () => setMessages([]) };
};