/**
 * Рекурсивно добавляет selectable, isLeaf и key к узлам дерева
 */
export function addSelectableProperty(node) {
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
 * Подготовка данных для отправки в LLM: оставляем только нужные поля
 */
export const prepareDataForLLM = (nodes) => {
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
 * Валидация структуры дерева, полученного от LLM
 */
export const validateTreeStructure = (data, path = 'root') => {
    // console.log("data",data);
    
    if (!Array.isArray(data)) {
        return { valid: false, error: `В ${path}: ожидается массив, получено ${typeof data}` };
    }
    
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const nodePath = `${path}[${i}]`;
        
        if (!node || typeof node !== 'object' || Array.isArray(node)) {
            return { valid: false, error: `В ${nodePath}: ожидается объект` };
        }
        if (typeof node.value !== 'string' && typeof node.value !== 'number') {
            return { valid: false, error: `В ${nodePath}.value: ожидается string/number` };
        }
        if (typeof node.title !== 'string') {
            return { valid: false, error: `В ${nodePath}.title: ожидается string` };
        }
        if (typeof node.isFolder !== 'boolean') {
            return { valid: false, error: `В ${nodePath}.isFolder: ожидается boolean` };
        }
        if (node.codeService !== undefined && typeof node.codeService !== 'string') {
            return { valid: false, error: `В ${nodePath}.codeService: ожидается string` };
        }
        if (node.level !== undefined && typeof node.level !== 'number') {
            return { valid: false, error: `В ${nodePath}.level: ожидается number` };
        }
        if (node.children !== undefined) {
            if (!Array.isArray(node.children)) {
                return { valid: false, error: `В ${nodePath}.children: ожидается массив` };
            }
            if (node.children.length > 0) {
                const childValidation = validateTreeStructure(node.children, `${nodePath}.children`);
                if (!childValidation.valid) return childValidation;
            }
        }
    }
    return { valid: true };
};