# AGENTS.md

Инструкции для AI-агентов и новых разработчиков. Читать **до** любых правок.
Локальный список известных проблем — в `ISSUES.md` (в git не попадает, см. `.gitignore`).

---

## 1. Что это за проект

Frontend портала цифровых услуг **АО «Мособлэнерго»** (`portal.mosoblenergo.ru`):
каталог услуг, калькулятор техприсоединения, подача/сопровождение заявок, личный кабинет,
документы, проверка ЭП, консультант-робот.

| | |
|---|---|
| Стек | React **19** · Vite **6** · Ant Design **6** · zustand **5** · react-router-dom **7** |
| Язык | **JavaScript (JSX)**. TypeScript в проекте нет и не планируется по факту |
| Стили | Ant Design + CSS Modules (`*.module.css`) + инлайн `style={{}}` |
| Бэкенд | внешний REST API, `baseURL` из `VITE_BACK_BACK_SERVER` |
| Пакетный менеджер | npm (`package-lock.json`), имя пакета `portal_front_new` |
| Объём | ~46 `.js` + 179 `.jsx` + 41 `.css` в `src/`, ~25.8k строк |

Продукт русскоязычный: **весь UI-текст, сообщения об ошибках, комментарии — на русском.**
Так же и коммиты (исторически: `"добавил условие отображения робота"`).

---

## 2. Команды

```bash
npm install            # установка
npm run dev            # vite --host (dev-сервер, доступен по сети)
npm run build          # production-сборка в dist/
npm run preview        # локальный просмотр dist/
npm run lint           # eslint .
```

Особенности:
- `npm run dev` поднимает `--host`; `vite.config.js` содержит `server.allowedHosts`
  (`test.mosoblenergo.ru`, `portal.mosoblenergo.ru`) — нужен для доступа через туннель/прокси.
- `npm run build` **проходит**, но занимает ~90 с и выдаёт предупреждение о чанке 4.86 МБ и о
  нерезолвящемся шрифте `assets/fonts/ariblk.ttf` — это известные проблемы, не регрессии.
- `npm run lint` сейчас даёт **259 ошибок / 57 предупреждений**. Это состояние `develop`,
  а не следствие вашей правки. Не пытайтесь «починить линт целиком» в рамках несвязанной задачи —
  правьте только то, что задели, и не увеличивайте число ошибок.
- Тестов нет, `npm test` нет. Если добавляете логику в `src/lib/*` — новый тест-фреймворк
  вводить не нужно без явной просьбы.

---

## 3. Переменные окружения

`.env` в git не попадает (`.gitignore`) и **содержит секреты**. Не коммитить, не логировать,
не копировать в код. Все переменные имеют префикс `VITE_` и **встраиваются в JS-бандл** —
секретов в них быть не должно (см. `ISSUES.md` п.2).

Реально используемые переменные (`grep import.meta.env`):

| Переменная | Назначение | Кол-во использований |
|---|---|---|
| `VITE_BACK_BACK_SERVER` | основной baseURL бэкенда | 41 |
| `VITE_BACK_VERSION` | `local` / `test` / `beta` — управляет видимостью робота и отладки | 4 |
| `VITE_BACK_SERVER_TEST` | тестовый сервер | 2 |
| `VITE_BACK_API_SERVER` | публичный API (без авторизации) | 1 |
| `VITE_BACK_SITE_MOSOBLENERGO_SERVER` | API основного сайта | 1 |
| `VITE_BACK_POLZA` | ключ Polza.ai ⚠️ | 1 |
| `VITE_BACK_BLOCK_SEND_CLAIM` | флаг блокировки отправки заявок | 1 |
| `VITE_BACK_CHECKSIG_SERVER` | ⚠️ **отсутствует в `.env`**, `checkSig` из-за этого не работает | 1 |

⚠️ `.env-example` устарел (там префиксы `REACT_APP_*`). **Не используйте его как источник правды**,
он не описывает текущий набор переменных.

Читать переменные только через `import.meta.env.VITE_*` (не `process.env` — это Vite, не CRA).
Хардкод URL бэкенда в компонентах — нарушение; есть легаси-исключения (вебхуки n8n), их не тиражировать.

---

## 4. Структура

```
index.html              точка входа; здесь же скрипт стороннего виджета чата ncc-chat
vite.config.js          плагин react + allowedHosts. Алиасов путей НЕТ
eslint.config.js        flat-config, js + react-hooks + react-refresh
src/
  main.jsx              createRoot → <App />
  App.jsx               ConfigProvider(antd) → BrowserRouter → Layout → Routes
  App.css               глобальные стили (256 строк)
  components/           переиспользуемые компоненты
    Global/             AppHeader, AppFooter, Auth (модалки входа), ChatGPT, ModalBot
    FormComponents/     ⚠️ старое поколение полей (мёртвое, см. ISSUES п.14)
    FormComponentsNew/  ✅ актуальные поля динамических форм
    Cabinet/            элементы ЛК (меню, документы, задачи)
    Filters/, Answers/, icons/, ...
  pages/                страницы по роутам (Main, Services, Calc, Cabinet, ...)
  stores/               zustand: useAuth, useGlobal, useServices, useContacts, ...
    Cabinet/            доменные сторы ЛК: useClaims, useDocuments, useProfile, ...
  lib/                  инфраструктура: http, clientLogger, b64toBlob, getPublicFile, viewSizeFile
  hooks/                useIsMobile, useN8nStream
  img/, files/          статические ассеты (⚠️ импортируются статически, попадают в бандл)
  version.json          ручной журнал релизов (страница /version)
```

Импорты — **только относительные**. Алиасов нет, поэтому в глубине встречается
`../../../../stores/...`. Количество `../` считать внимательно; при добавлении алиаса
(`@/`) сначала согласуйте с командой — это рефакторинг на 37 файлов.

---

## 5. Ключевые архитектурные паттерны

### 5.1 HTTP-слой

Есть единый инстанс `src/lib/http.js`:
```js
import http from "../../lib/http";
const res = await http.get("/api/cabinet/claims");
```
Он даёт: `baseURL`, `withCredentials`, `timeout: 10000`, логирование технических ошибок
в `/api/client-logs` и русские сообщения.

**Правило: новые запросы делать через `http`, а не через `axios` напрямую.**
Исторически в 45 файлах используется `axios` + ручной `Authorization: Bearer ${localStorage.getItem("jwt")}` —
это легаси (см. `ISSUES.md` п.13). Новый такой файл добавлять нельзя.
Глобальный перехват `401` (logout + открыть модалку входа) стоит в `App.jsx` на глобальном `axios`.

### 5.2 Сторы (zustand)

- Один стор = один домен. `create((set, get) => ({ ...state, ...actions }))`.
- Подписка **всегда селектором**, а не стором целиком:
  ```js
  const claims = useClaims((state) => state.claims);
  ```
  `const { a, b } = useStore()` вызывает ререндер на любое изменение стора — так делать не надо
  (в легаси встречается, в новом коде — нет).
- Действия именуются глаголом: `fetch*`, `set*`, `toggle*`, `clear*`, `upload*`.
- Асинхронные действия сами кладут результат в стор и сами выставляют `isLoading` / `error`.
- Глобальные сторы: `useAuth`, `useGlobal` (тема, текущая страница), `useServices` (каталог),
  `useContacts`, `useRegistration`, `useCalc`, `useMap`. Сторы ЛК — в `stores/Cabinet/`.
- `useAuth.getState()` допустим только вне React (в модулях/утилитах).

### 5.3 Динамические формы (главное в проекте)

Форма заявки/услуги **не написана руками** — она описывается данными с бэкенда
(«вебобмен»). Описание приходит как массив `chain`/`items`, где у каждого элемента есть
`item.component.Ref_Type` (тип поля), `item.label`, `item.idLine` (имя поля в форме),
`item.component.specialField` (подтип, например `"Телефон"`, `"ИНН"`, `"БИК"`),
`item.dependIdLine` + `item.dependСondition` (условие показа поля).

Рендеринг: `src/components/selectComponent.jsx` — длинная if-цепочка `Ref_Type`/`specialField` →
конкретный компонент:

```jsx
<formItems>.map((item, index) => selectComponent(item, index))
```

Каждое поле обёрнуто в `FormComponentsNew/WrapperComponent.jsx`, который отвечает за:
- видимость по зависимости (`dependOf` + `howDepend` через `Form.useWatch`);
- `style`/`stylesField_key` — стили приходят с бэкенда (`template.portalFields.styles`);
- режим «только чтение» (`read`) — тот же компонент рисует карточку просмотра.

**Как добавить новое поле:**
1. Создать компонент в `src/components/FormComponentsNew/MyInput.jsx`.
   Контракт пропсов: `name`, `label`, `disabled`, `placeholder`, `defaultValue`, `required`,
   `dependOf`, `howDepend`, `specialField`, `span`, `fullDescription`, `stylesField_key`, `read`
   (см. эталон `TextInput.jsx`, `DateInput.jsx`). Внутри — `Form.Item` + `WrapperComponent`.
2. Зарегистрировать ветку в `selectComponent.jsx` по `Ref_Type` (+`specialField`, если это подтип).
3. Если поле нужно и в старом стеке — **не надо**, старое поколение не развивается.
4. Проверить на реальном ответе бэкенда: без данных из вебобмена компонент не протестировать.

⚠️ Имя `dependСondition` содержит **кириллическую «С»** (U+0421), а не латинскую. Копировать
только копипастом из существующего кода; «исправление» на латиницу ломает связь с бэкендом
(32 использования в `selectComponent.jsx`).

### 5.4 Роутинг и доступ

`BrowserRouter` в `App.jsx`, все роуты объявлены там же. ЛК — вложенные роуты под
`<PrivateRoute />` (`src/pages/PrivateRouter.jsx`), который проверяет `useAuth().auth`
и редиректит на `/login`, сохраняя `redirection`.

Публичные: `/`, `/services`, `/services/:level2`, `/services/:level2/:key`, `/services-all`,
`/about`, `/privacy`, `/calc`, `/contacts`, `/docs`, `/answers`, `/checksig`, `/login`, `/error`, `*`→404.
ЛК (`/cabinet/*`): `new-claim/:id`, `profile`, `documents`, `checking`, `claimers`, `claimers/:id`,
`lk/:id`, `lkpage/:id`, `personal_accounts`, `archives`.

Служебные роуты (`/test`, `/tests`, `/chatgpt`, `/version`) — отладочные, живут в проде.
Новые отладочные страницы в `App.jsx` без надобности не добавлять.

### 5.5 Авторизация

Двухшаговая: `POST /api/auth/login` (email+password) → пин-код на почту →
`POST /api/auth/logincode` → `jwt` в `localStorage`. Валидация при загрузке —
`POST /api/auth/checkjwt`. Модалки входа/кода (`AuthModal`, `CodeModal`) отрендерены глобально
в `App.jsx` и управляются флагами из `useAuth` (`toggleModal("isAuthModalOpen", true)`).

⚠️ `PrivateRoute` сейчас теряет сессию при перезагрузке (нет флага «проверка ещё идёт»).
Если трогаете авторизацию — читайте `ISSUES.md` п.8.

### 5.6 Тема и оформление

`ConfigProvider` в `App.jsx`; `darkMode` из `useGlobal` переключает `theme.darkAlgorithm`
и сохраняется в `localStorage.darkMode`. Бренд: `colorPrimary: #0061aa`, `colorInfo: #F37021`.
Захардкоженные цвета в инлайн-стилях ломают тёмную тему — в новом коде брать цвета из
`theme.useToken()` или CSS-переменных, не из хексов.

### 5.7 Логирование

`src/lib/logging/clientLogger.js` → `POST /api/client-logs` (`level`, `event`, `message`, `details`).
Уже подключён в `http.js` и `useAuth`. Для новых важных сценариев — `clientLogger.error("DOMAIN/action", {...}, "текст")`.
Логгер не должен ломать основной поток (внутренний try/catch уже есть).
`console.log` в новом коде не добавлять; существующие 104 — техдолг.

### 5.8 Файлы и подписи

- `lib/getPublicFile.js` — получить файл по `fileId`+`ext` (base64 → blob → objectURL).
- `lib/b64toBlob.js`, `lib/viewSizeFile.js` — утилиты.
- `lib/checkSig.js` (e-trust, ⚠️ сломан, см. `ISSUES.md` п.5) и
  `components/Cabinet/checkSig.js` (проверка подписи документа в ЛК) — **разные функции с одинаковым именем**.
- `mimeType.json` — карта расширение → MIME.

### 5.9 Карта

OpenLayers (`ol`). Компоненты: `FormComponentsNew/mapComponents/MapDisplay.jsx`,
`MapInput.jsx`, `MapModal.jsx`. Яндекс.Карты выведены из эксплуатации (остался мёртвый
`MapDisplayYandex.jsx` — не воскрешать).

---

## 6. Соглашения по коду

Формальных линтеров на стиль нет (нет prettier/editorconfig), в коде смешаны 2 и 4 пробела.
**Правило: держать стиль окружающего файла.** Не переформатировать файл целиком — это делает
diff нечитаемым. В новом файле: 2 пробела, двойные кавычки, точка с запятой — так написана
самая свежая часть кода (`lib/`, `stores/`, `pages/Services`).

Имена: компоненты — `PascalCase.jsx`, по имени компонента; утилиты — `camelCase.js`;
CSS-модули — `Component.module.css` рядом с компонентом; классы — `styles.cardContainer`.
Сторы — `useXxx.js` + `export default useXxx`.

Обязательно:
- функциональные компоненты + хуки (классовых нет и не добавлять);
- `key` в списках — стабильный (`item.id`), а не `index`, если список фильтруется/сортируется;
- очистка эффектов: таймеры, `AbortController`, подписки, `URL.createObjectURL` — `revokeObjectURL`
  после использования (сейчас местами течёт);
- `useEffect` с честным массивом зависимостей (55 текущих `exhaustive-deps` — не повод добавлять ещё);
- ранний `return` только **после** всех хуков;
- ошибки бэкенда показывать пользователю (`message.error` из antd / текст на русском), а не только в консоль;
- `null`-безопасность: данные с бэкенда неполные, `?.` и `??` — норма.

Нельзя без явного согласования:
- менять `package.json` зависимости / версии `react`, `antd`, `vite`, `react-router-dom`;
- менять `.env`, `.env-example`, `vite.config.js`, `eslint.config.js`, `index.html`;
- добавлять TypeScript, новый стейт-менеджер, `redux`, `react-query`, монорепо-структуру;
- переписывать `App.jsx` целиком;
- удалять «непонятные» файлы — часть из них мёртвая, но часть подключается через бэкенд-описание
  (список мёртвых файлов — в `ISSUES.md` п.15).

---

## 7. Работа с git

Ветки: `main` (прод), `develop` (интеграция), `test`, `ivan`, `stas`.
CI нет, pre-commit хуков нет — единственная проверка это `npm run build` руками.

Перед коммитом:
```bash
npm run build      # должен пройти
npm run lint       # ошибок не должно стать больше, чем было
```
Коммит — на русском, по существу (`"добавил условие отображения робота"`), без `wip`/`fix`/`asdf`.

**Новые `*.md`-файлы:** `ISSUES.md` уже добавлен в `.gitignore` — локальные заметки
и отчёты о проблемах в удалённый репозиторий не отправляем. Не добавлять его `git add -f`.

Не коммитить: `.env`, `dist/`, `node_modules/`, скриншоты, логи, локальные `.md`-отчёты,
`*.pdf`, если это не часть задачи.

---

## 8. Известные грабли (кратко)

Полный разбор — в `ISSUES.md`. Самое важное, что можно случайно сломать:

1. **`PrivateRoute` + `checkJWT`** — гонка: `auth` стартует как `false`. Не «оптимизируйте» этот код
   без флага «проверка ещё идёт».
2. **`dependСondition`** — кириллическая «С». Копировать копипастом.
3. **`selectComponent.jsx`** — порядок проверок важен: ветки `TextInput` + `specialField`
   проверяются до общего `TextInput`. Новая ветка вставляется выше общей.
4. **`src/files/*.pdf` и `src/img/**`** импортируются статически → попадают в бандл (сейчас 4.86 МБ).
   Новые тяжёлые ассеты кладём в `public/`.
5. **`theme.useToken()`** нельзя читать выше `ConfigProvider` — вернёт дефолтные токены.
6. **Дубли имён:** `checkSig.js` ×2 (`lib/` и `components/Cabinet/`), `useServices`/`useServicesTest`,
   `StepsClaim`/`StepsClaim copy`, `AddressInput`/`AddressInput_old`. Перед импортом проверяйте путь.
7. **`console.log`** — 104 активных; не добавляйте свои как «отладку» в коммит.
8. **Робот** (`RobotAssistant`) рендерится только при `VITE_BACK_VERSION` = `local`/`test`.
   Не включайте его в прод «чтобы посмотреть».
9. **Виджет ncc-chat** подключается из `index.html` внешним скриптом с `:9090`
   (самоподписанный сертификат в тестовом окружении) — на локальной машине может блокироваться.
10. **`npm run build` ≈ 90 с** — это не зависание.

---

## 9. Definition of done

- [ ] `npm run build` проходит, новых предупреждений нет
- [ ] `npm run lint` — число ошибок не выросло
- [ ] нет новых `console.log`, хардкод-URL, новой утечки токена в код/HTML
- [ ] новые запросы — через `lib/http.js`
- [ ] новые хуки/таймеры/подписки очищаются
- [ ] UI-текст на русском
- [ ] проверено в браузере (`npm run dev`), в т.ч. на мобильной ширине (< 1199px, `useIsMobile`)
- [ ] если добавлено поле формы — проверено на реальных данных вебобмена и в режиме `read`
