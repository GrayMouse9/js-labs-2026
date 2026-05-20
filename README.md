# ЛР4 — REST API на Express.js

Бэкенд-сервер на Express.js с CRUD-эндпоинтами для коллекции карточек (`stocks`).  
Данные хранятся в JSON-файле на диске.

---

## Запуск

```bash
cd example-express
npm install
npm run dev      # с горячей перезагрузкой (nodemon)
# или
npm start        # без перезагрузки
```

Сервер поднимается на `http://localhost:3000`.

---

## Архитектура

```
example-express/src/
├── index.js                  # точка входа: Express app, middleware, запуск
├── routes/
│   └── stocks.js             # маршруты /stocks
├── controllers/
│   └── stocksController.js   # обработчики запросов
├── services/
│   ├── stocksService.js      # бизнес-логика (CRUD)
│   └── fileService.js        # чтение / запись JSON-файла
└── data/
    └── stocks.json           # хранилище данных
```

Поток запроса: `Router → Controller → Service → FileService → stocks.json`

---

## Middleware

В `index.js` подключены три middleware (в порядке исполнения):

| # | Что делает |
|---|-----------|
| 1 | `express.json()` — парсинг тела запроса |
| 2 | Логирование: выводит метод и URL каждого запроса |
| 3 | Глобальный 404-обработчик для неизвестных маршрутов |

---

## API — `/stocks`

### Коллекция

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/stocks` | Получить все карточки |
| `GET` | `/stocks?title=орбита` | Фильтрация по названию (поиск подстроки) |
| `POST` | `/stocks` | Создать карточку |
| `OPTIONS` | `/stocks` | Допустимые методы коллекции |

### Отдельный ресурс

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/stocks/:id` | Получить карточку по id |
| `PATCH` | `/stocks/:id` | Частичное обновление |
| `PUT` | `/stocks/:id` | Полная замена (нужны все поля) |
| `DELETE` | `/stocks/:id` | Удалить карточку |
| `HEAD` | `/stocks/:id` | Проверить существование (без тела, с `Content-Length`) |
| `OPTIONS` | `/stocks/:id` | Допустимые методы ресурса |

### Тело запроса (POST / PUT / PATCH)

```json
{
  "src": "https://...",
  "title": "Название",
  "text": "Описание"
}
```

POST и PUT требуют все три поля; PATCH принимает любое подмножество.

---

## Примеры запросов (Postman / curl)

```bash
# Получить все
curl http://localhost:3000/stocks

# Фильтр по названию
curl "http://localhost:3000/stocks?title=орбита"

# Создать
curl -X POST http://localhost:3000/stocks \
  -H "Content-Type: application/json" \
  -d '{"src":"https://example.com/img.jpg","title":"Новый этап","text":"Описание"}'

# Обновить поле
curl -X PATCH http://localhost:3000/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Обновлённый заголовок"}'

# Удалить
curl -X DELETE http://localhost:3000/stocks/1
```

---

## Коды ответов

| Код | Ситуация |
|-----|---------|
| `200` | Успех |
| `201` | Карточка создана |
| `204` | Карточка удалена (тело пустое) |
| `400` | Не все обязательные поля переданы |
| `404` | Карточка не найдена / маршрут не существует |
| `500` | Внутренняя ошибка сервера |
