import { useState, useCallback } from 'react';
import { searchWithAI } from '../utils/aiSearchUtils';

export const useAiSearch = (servicesAll) => {
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    const [aiSearchResults, setAiSearchResults] = useState(null);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiSearchError, setAiSearchError] = useState(null);

    const onAiSearch = useCallback(async () => {
        if (!aiSearchQuery.trim() || !servicesAll?.length) return;
        
        setIsAiSearching(true);
        setAiSearchError(null);
        
        try {
            const results = await searchWithAI(aiSearchQuery, servicesAll);
            setAiSearchResults(results);
        } catch (error) {
            console.error("Ошибка ИИ-поиска:", error);
            let userMessage = error.message;
            if (error.message.includes("некорректный") || error.message.includes("формат")) {
                userMessage = "🤖 ИИ не смог обработать запрос. Попробуйте повторить или уточните формулировку.";
            }
            setAiSearchError(userMessage);
            setAiSearchResults(null);
        } finally {
            setIsAiSearching(false);
        }
    }, [aiSearchQuery, servicesAll]);

    const clearAiSearch = useCallback(() => {
        setAiSearchQuery('');
        setAiSearchResults(null);
        setAiSearchError(null);
    }, []);

    const retryAiSearch = useCallback(() => {
        if (aiSearchQuery.trim()) onAiSearch();
    }, [aiSearchQuery, onAiSearch]);

    return {
        aiSearchQuery,
        setAiSearchQuery,
        aiSearchResults,
        isAiSearching,
        aiSearchError,
        onAiSearch,
        clearAiSearch,
        retryAiSearch
    };
};