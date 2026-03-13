import { useMemo, useCallback } from 'react';
import { addSelectableProperty } from '../utils/treeUtils';
import { filterTreeData, collectKeysForExpand, matchesAllWords } from '../utils/searchUtils';

export const useTreeData = (servicesAll, searchValue, aiSearchResults) => {
    const prepareTreeData = useCallback((data) => {
        if (!data) return [];
        const cloned = JSON.parse(JSON.stringify(data));
        addSelectableProperty(cloned);
        return cloned;
    }, []);

    const collectAllKeys = useCallback((nodes) => {
        const keys = [];
        const collect = (items) => {
            items.forEach(n => {
                keys.push(n.key);
                if (n.children?.length) collect(n.children);
            });
        };
        collect(nodes);
        return keys;
    }, []);

    return useMemo(() => {
        // ИИ-режим
        if (aiSearchResults !== null) {
            const prepared = prepareTreeData(aiSearchResults);
            return {
                displayedTreeData: prepared,
                keysToExpand: collectAllKeys(prepared),
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
    }, [servicesAll, searchValue, aiSearchResults, prepareTreeData, collectAllKeys]);
};