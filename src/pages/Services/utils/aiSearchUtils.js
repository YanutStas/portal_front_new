import { prepareDataForLLM, validateTreeStructure } from './treeUtils';

export const POLZA_API_URL = "https://api.polza.ai/v1/chat/completions";
// export const POLZA_MODEL = "qwen/qwen3-next-80b-a3b-instruct";
export const POLZA_MODEL = "qwen/qwen3-30b-a3b-instruct-2507";
export const API_KEY = import.meta.env.VITE_BACK_POLZA;

/**
 * Системный промпт для LLM
 */
export const createSystemPrompt = () => {
    return `Ты — помощник по поиску услуг электросетевой компании.
Твоя задача: проанализировать пользовательский запрос и отфильтровать древовидную структуру услуг, оставив только те узлы, которые наиболее релевантны запросу.

⚠️ КРИТИЧЕСКИ ВАЖНО:
- Возвращай ТОЛЬКО валидный JSON
- ВСЕГДА возвращай МАССИВ [], даже если найден только один узел
- Никогда не возвращай одиночный объект {}

ПРАВИЛА:
1. Возвращай ТОЛЬКО валидный JSON который всегда является массивом объектов без дополнительного текста, без markdown, без объяснений.
2. Сохраняй иерархическую структуру: если оставляешь дочерний узел — обязательно оставляй всех его родителей до корня.
3. Если услуга (isFolder: false) релевантна — оставляй её и всю цепочку папок до корня.
4. Если папка (isFolder: true) не содержит релевантных услуг в поддереве — удаляй её.
5. Не изменяй поля узлов, не добавляй новые поля, не меняй значения.
6. Если ничего не найдено — верни пустой массив [].
7. Если найдена одна услуга — верни [{...}]
8. Если найдено несколько услуг — верни [{...}, {...}]
9. Если ничего не найдено — верни []

ФОРМАТ ОТВЕТА:
[
  {
    "value": "uuid",
    "title": "Название узла",
    "isFolder": true/false,
    "codeService": "код или undefined",
    "level": 1-5,
    "children": [ ... ]
  }
]

Даже если корневой объект один всегда возвращай его в массиве

Пример запроса: "хочу подключить частный дом к электричеству, мощность до 15 кВт"`;
};

/**
 * Улучшенный парсинг ответа от LLM
 */
export const parseLLMResponse = (content) => {
    if (!content) throw new Error("Пустой ответ от LLM");

    let cleanContent = content
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .replace(/^```\s*/, '')
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(cleanContent);
    } catch (e) {
        // Попытка исправить частые ошибки
        cleanContent = cleanContent.replace(/,(\s*[}\]])/g, '$1');
        try {
            parsed = JSON.parse(cleanContent);
        } catch (e) {
            const preview = cleanContent.slice(0, 500) + (cleanContent.length > 500 ? '...' : '');
            throw new Error(`Не удалось распарсить JSON.\n\nНачало: ${preview}\n\nОшибка: ${e.message}`);
        }
    }

    // 🔴 ПРОВЕРКА: Если это объект (не массив) — оборачиваем в массив
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        console.warn('⚠️ LLM вернула объект вместо массива, авто-оборачиваем...');
        parsed = [parsed];
    }

    // 🔴 Дополнительная проверка: если это примитив — ошибка
    if (!parsed || typeof parsed !== 'object') {
        throw new Error(`LLM вернула неожиданный тип данных: ${typeof parsed}`);
    }

    return parsed;
};

/**
 * Основной запрос к polza.ai
 */
export const searchWithAI = async (userQuery, treeData) => {
    if (!API_KEY) throw new Error("API ключ polza.ai не найден. Проверьте VITE_BACK_POLZA");

    const simplifiedTree = prepareDataForLLM(treeData);
    const dataForPrompt = JSON.stringify(simplifiedTree, null, 2);

    const messages = [
        { role: "system", content: createSystemPrompt() },
        { role: "user", content: `Запрос: "${userQuery}"\n\nСтруктура:\n${dataForPrompt}` }
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
            temperature: 0.1,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка API: ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    let parsed;
    try {
        parsed = parseLLMResponse(content);
    } catch (parseError) {
        console.error("❌ Ошибка парсинга LLM:", { query: userQuery, error: parseError.message });
        throw new Error("ИИ вернул некорректный формат. Попробуйте повторить поиск.");
    }

    const validation = validateTreeStructure(parsed);
    // console.log("validation",validation);
    
    if (!validation.valid) {
        console.error("❌ Валидация структуры:", { query: userQuery, error: validation.error });
        throw new Error(`Неверный формат данных: ${validation.error}`);
    }

    return parsed;
};