import React from 'react';
import { Input, Tooltip, Alert, Button } from 'antd';
import { RobotOutlined, CloseOutlined } from '@ant-design/icons';


const { Search } = Input

const { Text } = Input;

export const SearchBar = ({
    // Обычный поиск
    searchValue,
    onSearchChange,
    isAiMode,

    // ИИ-поиск
    aiSearchQuery,
    setAiSearchQuery,
    isAiSearching,
    aiSearchError,
    onAiSearch,
    clearAiSearch,
    retryAiSearch,
    handleAiSearchKeyDown
}) => {
    return (
        <>
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

            {/* ИИ-поиск */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                
                <Tooltip title="Найти с помощью ИИ">
                    <Search
                        placeholder="🤖 ИИ-поиск: 'подключить дом 15 кВт'"
                        value={aiSearchQuery}
                        onChange={(e) => setAiSearchQuery(e.target.value)}
                        onKeyDown={handleAiSearchKeyDown}
                        size="small"
                        disabled={isAiSearching}
                        prefix={
                            <Tooltip title="Поиск с помощью ИИ">
                                <RobotOutlined style={{ color: aiSearchQuery ? '#1890ff' : '#999' }} />
                            </Tooltip>
                        }
                        suffix={
                            (aiSearchQuery || !isAiSearching) && (
                                <CloseOutlined
                                    style={{ cursor: 'pointer', color: '#999' }}
                                    onClick={clearAiSearch}
                                />
                            )
                        }



                        onSearch={onAiSearch}
                        loading={isAiSearching}
                        enterButton={<RobotOutlined />}
                    />
                </Tooltip>
            </div>

            {/* Ошибка ИИ-поиска */}
            {aiSearchError && (
                <Alert
                    message="Ошибка поиска"
                    description={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span>{aiSearchError}</span>
                            <Tooltip title="Повторить поиск">
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={retryAiSearch}
                                    disabled={isAiSearching}
                                    style={{ padding: 0 }}
                                >
                                    Повторить
                                </Button>
                            </Tooltip>
                        </div>
                    }
                    type="warning"
                    showIcon
                    closable
                    style={{ marginBottom: 8 }}
                    onClose={() => { }}
                />
            )}
        </>
    );
};