# Лабораторная работа №6 — fetch, Promise, async/await и сборка Vite

## Содержание

1. [Описание](#описание)
2. [Что изменилось по сравнению с ЛР5](#что-изменилось-по-сравнению-с-лр5)
3. [Часть 1 — fetch и async/await](#часть-1--fetch-и-asyncawait)
4. [Часть 2 — сборка Vite](#часть-2--сборка-vite)
5. [Структура проекта](#структура-проекта)
6. [Запуск проекта](#запуск-проекта)
7. [Демонстрация async/await](#демонстрация-asyncawait)

---

## Описание

Лабораторная работа состоит из двух частей:

- **Часть 1** — замена `XMLHttpRequest` на современный `fetch` с использованием `Promise`, `async/await` и `try/catch`.
- **Часть 2** — сборка клиентской части через **Vite** и раздача фронтенда в качестве статики с бэкенда, что решает проблему CORS без расширений.

---

## Что изменилось по сравнению с ЛР5

| Файл | ЛР5 | ЛР6 |
|---|---|---|
| `modules/ajax.js` | `XMLHttpRequest` + коллбэки | `fetch` + `async/await`, методы возвращают `Promise` |
| `pages/main/index.js` | `getData()` с коллбэком | `async getData()` с `await` + `try/catch` |
| `pages/trajectory/index.js` | то же | то же |
| `index.html` | CDN-ссылки на Bootstrap, importmap для Three.js | Vite сам разрешает импорты |
| `main.js` | Bootstrap подключался через `<link>` | `import 'bootstrap'` через npm |
| `package.json` | нет скриптов сборки | `dev`, `build`, `preview` через Vite |
| `vite.config.js` | отсутствовал | создан |
| `static/` | `models/` в корне | `.glb`-модели переехали в `static/` (publicDir Vite) |

---

## Часть 1 — fetch и async/await

### ajax.js

`XMLHttpRequest` с коллбэками заменён на единый приватный метод `_request`, использующий `fetch`. Все публичные методы теперь возвращают `Promise`:

```js
class Ajax {
    async _request(method, url, data) {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data !== undefined) options.body = JSON.stringify(data);

        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    get(url)         { return this._request('GET', url); }
    post(url, data)  { return this._request('POST', url, data); }
    patch(url, data) { return this._request('PATCH', url, data); }
    delete(url)      { return this._request('DELETE', url); }
}
```

### Использование в страницах

Вместо коллбэка — `await` и `try/catch`:

```js
// ЛР5 (было)
getData() {
    ajax.get(url, (data) => {
        this.renderData(data);
    });
}

// ЛР6 (стало)
async getData() {
    try {
        const data = await ajax.get(url);
        this.renderData(data);
    } catch (err) {
        console.error('Ошибка загрузки:', err);
    }
}
```

---

## Часть 2 — сборка Vite

### vite.config.js

```js
export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    publicDir: 'static',
};
```

- `outDir` — куда Vite складывает готовую сборку (`public/`)
- `publicDir` — папка со статическими файлами (`.glb`-модели), которые копируются в сборку как есть

### Структура static/

3D-модели переехали из `models/` в `static/`, чтобы Vite их раздавал:

```
static/
├── Moon.glb
├── RocketShip.glb
└── InternationalSpaceStation.glb
```

### Раздача фронтенда с бэкенда

После `npm run build` папка `public/` копируется в проект с бэкендом. Бэкенд раздаёт её как статику — CORS-проблем нет, так как фронт и API на одном домене.

---

## Структура проекта

```
├── components/
│   ├── back-button/
│   ├── trajectory/         # Async-демо теперь использует fetch + Promise.all
│   └── trajectory-card/
├── example-express/        # Бэкенд Express
│   └── src/
│       ├── controllers/
│       ├── data/
│       ├── routes/
│       └── services/
├── modules/
│   ├── ajax.js             # fetch + async/await вместо XHR
│   └── trajectoryUrls.js
├── pages/
│   ├── main/               # async getData() с await
│   └── trajectory/         # async getData() с await
├── static/                 # 3D-модели для Vite publicDir
├── index.html              # упрощён под Vite
├── main.js                 # Bootstrap через import
├── vite.config.js
└── style.css
```

---

## Запуск проекта

Проект можно запустить в двух режимах.

### Режим разработки (dev) — два терминала

**Терминал 1 — бэкенд:**

```bash
cd example-express
npm install
npm run dev
```

Сервер запустится на `http://localhost:3000`.

**Терминал 2 — фронтенд через Vite:**

```bash
npm install
npm run dev
```

Vite запустит dev-сервер на `http://localhost:5173`. В этом режиме CORS настроен на бэкенде (`Access-Control-Allow-Origin: *`), поэтому расширения не нужны.

---

### Режим production (сборка + статика)

**Шаг 1** — собрать фронтенд:

```bash
npm run build
```

В корне появится папка `public/` с готовой сборкой.

**Шаг 2** — скопировать `public/` в папку с бэкендом:

```bash
cp -r public/ example-express/public/
```

**Шаг 3** — добавить раздачу статики в бэкенд (`example-express/src/index.js`):

```js
const path = require('path');

// после app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')));
```

**Шаг 4** — запустить бэкенд:

```bash
cd example-express
npm run dev
```

Откройте `http://localhost:3000` — там будет и фронтенд, и API на одном домене, без CORS.

---

## Демонстрация async/await

### Скрипт для консоли браузера

Показывает разницу между последовательным и параллельным выполнением запросов через `fetch`. Убедитесь, что бэкенд запущен (сервер поддерживает `?delay=N` — задерживает ответ на N мс).

```js
function timestamp() {
    const t = new Date();
    return t.toLocaleTimeString('ru-RU') + '.' + String(t.getMilliseconds()).padStart(3, '0');
}

async function demo() {
    console.log('=== Старт демо ===');

    // Параллельно — оба запроса стартуют одновременно
    console.log(`[${timestamp()}] Запускаем оба запроса через Promise.all`);
    const [dataA, dataB] = await Promise.all([
        fetch('http://localhost:3000/trajectories/1?delay=3000').then(r => r.json()),
        fetch('http://localhost:3000/trajectories/2').then(r => r.json()),
    ]);
    console.log(`[${timestamp()}] ✓ A: "${dataA.title}"`);
    console.log(`[${timestamp()}] ✓ B: "${dataB.title}"`);
    console.log(`[${timestamp()}] Сумма id: ${dataA.id} + ${dataB.id} = ${dataA.id + dataB.id}`);
    console.log('=== Итог: суммарное время ≈ 3000 мс (не 3000+0=3000 последовательно) ===');
}

demo();
```

**Ожидаемый вывод:**

```
=== Старт демо ===
[12:00:00.000] Запускаем оба запроса через Promise.all
[12:00:00.015] ✓ B: "Гравитационный маневр"   ← ответил сразу
[12:00:03.005] ✓ A: "Прямой перелет"           ← ответил через 3 сек
[12:00:03.005] Сумма id: 1 + 2 = 3
=== Итог: суммарное время ≈ 3000 мс (не 3000+0=3000 последовательно) ===
```

### Async-демо в интерфейсе

На странице каждой траектории есть блок **«Async-демо: сложение двух значений»**:

- Поля **A** и **B** — число и задержка в мс
- Кнопки **«Сохранить»** — одиночный `fetch`-запрос с задержкой
- Кнопка **«Σ await»** — запускает оба `fetch` через `Promise.all`, выводит сумму когда оба завершились

В логе под кнопками видно, какой запрос завершился раньше, независимо от порядка запуска.
