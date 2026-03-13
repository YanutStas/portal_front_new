import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Splitter, Tree, Typography, Input, Tooltip, Spin, Alert } from "antd";
import { SearchOutlined, RobotOutlined, CloseOutlined, OpenAIOutlined } from "@ant-design/icons";
import useServices from "../../stores/useServices";
import ServiceItem from "../ServiceItem/ServiceItem";
import Preloader from "../../components/Main/Preloader";
import Container from "../../components/Container";

const { Search } = Input;
const { DirectoryTree } = Tree;
const { Text, Title } = Typography;

// === КОНСТАНТЫ ===
const POLZA_API_URL = "https://api.polza.ai/v1/chat/completions";
const POLZA_MODEL = "qwen/qwen3-next-80b-a3b-instruct";
// const POLZA_MODEL = "qwen/qwen3.5-122b-a10b";
const API_KEY = import.meta.env.VITE_BACK_POLZA;

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

/**
 * Рекурсивно добавляет selectable, isLeaf и key
 */
function addSelectableProperty(node) {
    if (Array.isArray(node)) {
        node.forEach(item => addSelectableProperty(item));
        return;
    }
    if (typeof node !== 'object' || node === null) return;

    if (typeof node.isFolder === 'boolean') {
        node.selectable = !node.isFolder;
        node.isLeaf = !node.isFolder;
    }

    if (!node.key) {
        node.key = node.value || `${node.title}_${Math.random().toString(36).substr(2, 9)}`;
    }

    for (const key in node) {
        if (!node.hasOwnProperty(key)) continue;
        const value = node[key];
        if (typeof value === 'object' && value !== null) {
            addSelectableProperty(value);
        }
    }
}

/**
 * 🔴 ПРЕПОДГОТОВКА ДАННЫХ ДЛЯ LLM: оставляем только нужные поля
 */
const prepareDataForLLM = (nodes) => {
    return nodes.map(node => {
        const simplified = {
            value: node.value,
            title: node.title,
            isFolder: node.isFolder,
            codeService: node.codeService || undefined,
            level: node.level,
        };
        if (node.children?.length) {
            simplified.children = prepareDataForLLM(node.children);
        }
        return simplified;
    });
};

/**
 * 🔴 ФОРМИРОВАНИЕ СИСТЕМНОГО ПРОМПТА
 */
const createSystemPrompt = () => {
    return `Ты — помощник по поиску услуг электросетевой компании.
Твоя задача: проанализировать пользовательский запрос и отфильтровать древовидную структуру услуг, оставив только те узлы, которые наиболее релевантны запросу.

ПРАВИЛА:
1. Возвращай ТОЛЬКО валидный JSON без дополнительного текста, без markdown, без объяснений.
2. Сохраняй иерархическую структуру: если оставляешь дочерний узел — обязательно оставляй всех его родителей до корня.
3. Если услуга (isFolder: false) релевантна — оставляй её и всю цепочку папок до корня.
4. Если папка (isFolder: true) не содержит релевантных услуг в поддереве — удаляй её.
5. Не изменяй поля узлов, не добавляй новые поля, не меняй значения.
6. Если ничего не найдено — верни пустой массив [].

ФОРМАТ ОТВЕТА:
[
  {
    "value": "uuid",
    "title": "Название узла",
    "isFolder": true/false,
    "codeService": "код или undefined",
    "level": 1-5,
    "children": [ ... ] // только если есть релевантные дети
  },
  ...
]

Пример запроса пользователя: "хочу подключить частный дом к электричеству, мощность до 15 кВт"
Пример релевантных узлов: услуги с "технологическое присоединение", "до 150 кВт", "частный дом", "категория надежности".`;
};

/**
 * 🔴 ЗАПРОС К POLZA.AI API
 */
const searchWithAI = async (userQuery, treeData) => {
    if (!API_KEY) {
        throw new Error("API ключ polza.ai не найден. Проверьте переменную VITE_BACK_POLZA");
    }

    const simplifiedTree = prepareDataForLLM(treeData);

    // Ограничиваем размер данных для токенов (опционально можно добавить сжатие)
    const dataForPrompt = JSON.stringify(simplifiedTree, null, 2);

    const messages = [
        { role: "system", content: createSystemPrompt() },
        {
            role: "user",
            content: `Пользовательский запрос: "${userQuery}"\n\nСтруктура услуг:\n${dataForPrompt}`
        }
    ];

    const response = await fetch(POLZA_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: POLZA_MODEL,
            messages,
            temperature: 0.1, // Минимальная креативность для точного JSON
            response_format: { type: "json_object" } // Требуем строго JSON
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка API polza.ai: ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("Пустой ответ от LLM");
    }

    // Парсим JSON, убирая возможные markdown-обёртки
    let parsed;
    try {
        const cleanContent = content.replace(/^```json\s*|\s*```$/g, '').trim();
        parsed = JSON.parse(cleanContent);
    } catch (e) {
        console.error("Не удалось распарсить JSON от LLM:", content);
        throw new Error("LLM вернула невалидный JSON");
    }

    return parsed;
};

/**
 * Рекурсивная фильтрация дерева (для обычного поиска)
 */
const matchesAllWords = (text, searchValue) => {
    if (!searchValue || !text) return false;
    const searchWords = searchValue.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (searchWords.length === 0) return false;
    const textLower = text.toLowerCase();
    return searchWords.every(word => textLower.includes(word));
};

const filterTreeData = (treeData, searchValue) => {
    if (!searchValue || !treeData) return treeData;
    const filter = (nodes) => {
        return nodes.reduce((acc, node) => {
            const newNode = { ...node };
            if (newNode.children) {
                newNode.children = filter(newNode.children);
            }
            const titleMatch = matchesAllWords(newNode.title, searchValue);
            const hasMatchingChildren = newNode.children?.length > 0;
            if (titleMatch || hasMatchingChildren) {
                acc.push(newNode);
            }
            return acc;
        }, []);
    };
    return filter(treeData);
};

const collectKeysForExpand = (nodes, searchValue, resultKeys = [], parentKeys = []) => {
    if (!searchValue || !nodes) return resultKeys;
    nodes.forEach(node => {
        const titleMatch = matchesAllWords(node.title, searchValue);
        if (titleMatch) {
            resultKeys.push(node.key);
            parentKeys.forEach(pk => { if (!resultKeys.includes(pk)) resultKeys.push(pk); });
        }
        if (node.children?.length) {
            collectKeysForExpand(node.children, searchValue, resultKeys, [...parentKeys, node.key]);
        }
    });
    return resultKeys;
};

const highlightText = (text, searchValue) => {
    if (!searchValue || !text) return text;
    const searchWords = searchValue.split(/\s+/).filter(w => w.length >= 2);
    if (searchWords.length === 0) return text;
    const regex = new RegExp(`(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <Text key={index} style={{ color: 'red', fontWeight: 600 }}>{part}</Text>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};

// === КОМПОНЕНТ ===

export default function ServicesAll() {
    const [selected, setSelected] = useState(null);
    const isLoadingAll = useServices((state) => state.isLoadingAll);
    const servicesAll = useServices((state) => state.servicesAll);
    const fetchServicesAll = useServices((state) => state.fetchServicesAll);

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    // 🔴 Состояния для ИИ-поиска
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    const [aiSearchResults, setAiSearchResults] = useState(null);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiSearchError, setAiSearchError] = useState(null);

    const prepareTreeData = useCallback((data) => {
        if (!data) return [];
        const cloned = JSON.parse(JSON.stringify(data));
        addSelectableProperty(cloned);
        return cloned;
    }, []);

    // 🔴 Определяем, какие данные показывать: обычные или ИИ-результаты
    const { displayedTreeData, keysToExpand, isAiMode } = useMemo(() => {
        if (aiSearchResults !== null) {
            // ИИ-режим: используем результаты от LLM
            const prepared = prepareTreeData(aiSearchResults);
            // Разворачиваем все узлы в ИИ-режиме для удобства
            const allKeys = [];
            const collectAllKeys = (nodes) => {
                nodes.forEach(n => {
                    allKeys.push(n.key);
                    if (n.children?.length) collectAllKeys(n.children);
                });
            };
            collectAllKeys(prepared);
            return {
                displayedTreeData: prepared,
                keysToExpand: allKeys,
                isAiMode: true
            };
        }

        // Обычный режим
        const prepared = prepareTreeData(servicesAll);
        const expandKeys = searchValue ? collectKeysForExpand(prepared, searchValue) : [];
        const filtered = searchValue ? filterTreeData(prepared, searchValue) : prepared;
        return {
            displayedTreeData: filtered,
            keysToExpand: expandKeys,
            isAiMode: false
        };
    }, [servicesAll, searchValue, aiSearchResults, prepareTreeData]);

    const onSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchValue(value);
        // При обычном поиске сбрасываем ИИ-результаты
        if (aiSearchResults !== null) {
            setAiSearchResults(null);
            setAiSearchQuery('');
        }
        if (!value) {
            setExpandedKeys([]);
            setAutoExpandParent(false);
        } else {
            setAutoExpandParent(true);
        }
    }, [aiSearchResults]);

    // 🔴 Обработчик ИИ-поиска
    const onAiSearch = useCallback(async () => {
        if (!aiSearchQuery.trim() || !servicesAll?.length) return;

        setIsAiSearching(true);
        setAiSearchError(null);

        try {
            const results = await searchWithAI(aiSearchQuery, servicesAll);
            setAiSearchResults(results);
            setExpandedKeys([]); // Будут установлены через useMemo
            setAutoExpandParent(true);
        } catch (error) {
            console.error("Ошибка ИИ-поиска:", error);
            setAiSearchError(error.message || "Не удалось выполнить поиск");
            setAiSearchResults(null);
        } finally {
            setIsAiSearching(false);
        }
    }, [aiSearchQuery, servicesAll]);

    // 🔴 Очистка ИИ-поиска
    const clearAiSearch = useCallback(() => {
        setAiSearchQuery('');
        setAiSearchResults(null);
        setAiSearchError(null);
        setSearchValue(''); // Также очищаем обычный поиск
    }, []);

    const onSelect = useCallback((selectedKeys, info) => {
        console.log('selected', info.node.value);
        setSelected(info.node.value);
    }, []);

    const onExpand = useCallback((keys) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try { await fetchServicesAll(); }
            catch (err) { console.error("Ошибка загрузки:", err); }
        };
        fetchData();
    }, [fetchServicesAll]);

    useEffect(() => { setExpandedKeys(keysToExpand); }, [keysToExpand]);

    // Обработка Enter в поле ИИ-поиска
    const handleAiSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            onAiSearch();
        }
    };

    return (
        <>
            <Container>
                <Title level={2}>Иерархия всех услуг</Title>

                {isLoadingAll && <Preloader />}

                {!isLoadingAll && (
                    <Splitter layout="horizontal" style={{ minHeight: '600px' }}>
                        <Splitter.Panel defaultSize="30%" min="20%" max="70%">
                            {/* Обычный поиск */}
                            <Search
                                style={{ marginBottom: 8 }}
                                placeholder="Обычный поиск: 'до 150 по III'"
                                onChange={onSearchChange}
                                value={searchValue}
                                allowClear
                                size="small"
                                disabled={isAiMode}
                            />

                            {/* 🔴 ИИ-поиск */}

                            <Search
                                style={{ marginBottom: 8 }}
                                value={aiSearchQuery}
                                onChange={(e) => setAiSearchQuery(e.target.value)}
                                onKeyDown={handleAiSearchKeyDown}
                                placeholder="ИИ-поиск"
                                disabled={isAiSearching}
                                onSearch={onAiSearch}
                                loading={isAiSearching}
                                size="small"
                                // style={{ width: '40px' }}
                                prefix={
                                    <Tooltip title="Поиск с помощью ИИ">
                                        <RobotOutlined style={{ color: aiSearchQuery ? '#1890ff' : '#999' }} />
                                    </Tooltip>
                                }
                                suffix={
                                    (aiSearchQuery || aiSearchResults) && (
                                        <CloseOutlined
                                            style={{ cursor: 'pointer', color: '#999' }}
                                            onClick={clearAiSearch}
                                        />
                                    )
                                }
                                enterButton={<RobotOutlined />}
                            />

                            {/* Ошибка ИИ-поиска */}
                            {aiSearchError && (
                                <Alert
                                    message="Ошибка поиска"
                                    description={aiSearchError}
                                    type="error"
                                    showIcon
                                    closable
                                    style={{ marginBottom: 8 }}
                                    onClose={() => setAiSearchError(null)}
                                />
                            )}

                            {/* Индикатор ИИ-режима */}
                            {isAiMode && !isAiSearching && (
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                                    🤖 Показаны результаты ИИ-поиска по запросу: "{aiSearchQuery}"
                                </Text>
                            )}
                            {isAiSearching && <Text>Подождите идет ИИ-поиск...</Text>}
                            {!isAiSearching &&
                                <DirectoryTree
                                    onSelect={onSelect}
                                    onExpand={onExpand}
                                    treeData={displayedTreeData}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    selectable
                                    showIcon={false}
                                    style={{ background: 'transparent' }}
                                    titleRender={(node) => {
                                        // Подсветка только в обычном режиме
                                        return !isAiMode ? highlightText(node.title, searchValue) : node.title;
                                    }}
                                    // 🔴 Пустое состояние
                                    emptyText={
                                        <Text type="secondary">
                                            {isAiMode ? "ИИ не нашёл подходящих услуг" : "Ничего не найдено"}
                                        </Text>
                                    }
                                />
                            }
                        </Splitter.Panel>

                        <Splitter.Panel>
                            <div style={{ padding: "0 16px" }}>
                                {selected ? (
                                    <ServiceItem key={selected} currentKey={selected} />
                                ) : (
                                    <Text type="secondary">
                                        Выберите услугу из списка для просмотра деталей
                                    </Text>
                                )}
                            </div>
                        </Splitter.Panel>
                    </Splitter>
                )}
            </Container>
        </>
    );
}