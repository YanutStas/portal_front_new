import { Typography } from 'antd'
const { Text } = Typography
/**
 * Проверяет, содержатся ли ВСЕ слова из запроса в тексте
 */
export const matchesAllWords = (text, searchValue) => {
    if (!searchValue || !text) return false;
    const searchWords = searchValue.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
    if (searchWords.length === 0) return false;
    const textLower = text.toLowerCase();
    return searchWords.every(word => textLower.includes(word));
};

/**
 * Рекурсивная фильтрация дерева
 */
export const filterTreeData = (treeData, searchValue) => {
    if (!searchValue || !treeData) return treeData;

    const filter = (nodes) => {
        return nodes.reduce((acc, node) => {
            const newNode = { ...node };
            if (newNode.children) {
                newNode.children = filter(newNode.children);
            }
            const titleMatch = matchesAllWords(newNode.title, searchValue);
            const hasMatchingChildren = newNode.children?.length > 0;
            if (titleMatch || hasMatchingChildren) acc.push(newNode);
            return acc;
        }, []);
    };
    return filter(treeData);
};

/**
 * Собирает ключи для авто-разворачивания
 */
export const collectKeysForExpand = (nodes, searchValue, resultKeys = [], parentKeys = []) => {
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

/**
 * Подсветка найденных слов
 */
export const highlightText = (text, searchValue) => {
    if (!searchValue || !text) return text;

    const searchWords = searchValue.split(/\s+/).filter(w => w.length >= 2);
    if (searchWords.length === 0) return text;

    const regex = new RegExp(
        `(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
        'gi'
    );
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (

                    <Text key={index} style={{ color: 'red', fontWeight: 600 }}>{part}</Text>
                ) : <span key={index}>{part}</span>
            )}
        </>
    );
};