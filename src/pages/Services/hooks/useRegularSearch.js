import { useState, useCallback } from 'react';

export const useRegularSearch = (onAiResultsClear) => {
    const [searchValue, setSearchValue] = useState('');
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const onSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        // Сбрасываем ИИ-режим при обычном поиске
        if (onAiResultsClear && value) {
            onAiResultsClear();
        }
        
        if (!value) {
            setExpandedKeys([]);
            setAutoExpandParent(false);
        } else {
            setAutoExpandParent(true);
        }
    }, [onAiResultsClear]);

    const onExpand = useCallback((keys) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    }, []);

    return {
        searchValue,
        expandedKeys,
        autoExpandParent,
        setExpandedKeys,
        setAutoExpandParent,
        onSearchChange,
        onExpand
    };
};