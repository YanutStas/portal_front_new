import React, { useEffect, useCallback } from "react";
import { Splitter, Typography } from "antd";
import useServices from "../../stores/useServices";
import Preloader from "../../components/Main/Preloader";
import Container from "../../components/Container";

// Локальные импорты
import { useTreeData } from './hooks/useTreeData';
import { useAiSearch } from './hooks/useAiSearch';
import { useRegularSearch } from './hooks/useRegularSearch';
import { SearchBar } from './components/SearchBar';
import { ServiceTree } from './components/ServiceTree';
import { ServiceDetails } from './components/ServiceDetails';

const { Title, Text } = Typography;

export default function ServicesAll() {
    const [selected, setSelected] = React.useState(null);
    const isLoadingAll = useServices((state) => state.isLoadingAll);
    const servicesAll = useServices((state) => state.servicesAll);
    const fetchServicesAll = useServices((state) => state.fetchServicesAll);

    const aiSearch = useAiSearch(servicesAll);
    const regularSearch = useRegularSearch(aiSearch.clearAiSearch);
    // Хуки
    const { displayedTreeData, keysToExpand, isAiMode } = useTreeData(
        servicesAll,
        regularSearch.searchValue,
        aiSearch.aiSearchResults
    );


    // Синхронизация expandedKeys
    useEffect(() => {
        regularSearch.setExpandedKeys(keysToExpand);
    }, [keysToExpand]);

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try { await fetchServicesAll(); }
            catch (err) { console.error("Ошибка загрузки:", err); }
        };
        fetchData();
    }, [fetchServicesAll]);

    // Обработчики
    const onSelect = useCallback((_, info) => {
        setSelected(info.node.value);
    }, []);

    const handleAiSearchKeyDown = useCallback((e) => {
        if (e.key === 'Enter') aiSearch.onAiSearch();
    }, [aiSearch.onAiSearch]);

    return (
        <Container>
            <Title level={2}>Иерархия всех услуг</Title>

            {isLoadingAll && <Preloader />}

            {!isLoadingAll && (
                <Splitter layout="horizontal" style={{ minHeight: '600px' }}>
                    <Splitter.Panel
                        defaultSize="30%"
                        min="20%"
                        max="70%"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden' // Важно: скрываем всё, что вылезает за границы панели
                        }}
                    >
                        {/* Контейнер для поиска и дерева */}

                        {/* Блок поиска (не прокручивается) */}
                        <div style={{ flexShrink: 0, marginBottom: '12px' }}>
                            <SearchBar
                                // Обычный поиск
                                searchValue={regularSearch.searchValue}
                                onSearchChange={regularSearch.onSearchChange}
                                isAiMode={isAiMode}

                                // ИИ-поиск
                                aiSearchQuery={aiSearch.aiSearchQuery}
                                setAiSearchQuery={aiSearch.setAiSearchQuery}
                                isAiSearching={aiSearch.isAiSearching}
                                aiSearchError={aiSearch.aiSearchError}
                                onAiSearch={aiSearch.onAiSearch}
                                clearAiSearch={aiSearch.clearAiSearch}
                                retryAiSearch={aiSearch.retryAiSearch}
                                handleAiSearchKeyDown={handleAiSearchKeyDown}
                            />

                            {isAiMode && !aiSearch.isAiSearching && (
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                                    🤖 Результаты ИИ-поиска: "{aiSearch.aiSearchQuery}"
                                </Text>
                            )}
                            {aiSearch.isAiSearching && <Text>🤖 ИИ ищет...</Text>}
                        </div>

                        {/* Блок дерева (прокручивается) */}
                        <div style={{
                            // flex: 1,           // Занимает всё оставшееся место
                            overflowY: 'auto', // Включает вертикальную прокрутку
                            maxHeight: 800       // Важно для работы flex + scroll в Firefox
                        }}>
                            {!aiSearch.isAiSearching && (
                                <ServiceTree
                                    treeData={displayedTreeData}
                                    expandedKeys={regularSearch.expandedKeys}
                                    autoExpandParent={regularSearch.autoExpandParent}
                                    onSelect={onSelect}
                                    onExpand={regularSearch.onExpand}
                                    isAiMode={isAiMode}
                                    searchValue={regularSearch.searchValue}
                                />
                            )}
                        </div>

                    </Splitter.Panel>

                    <Splitter.Panel>
                        <ServiceDetails selectedKey={selected} />
                    </Splitter.Panel>
                </Splitter>
            )}
        </Container>
    );
}