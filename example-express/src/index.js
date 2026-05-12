const express = require('express');
const path = require('path');
// Импортируем обновленные файлы
const trajectoriesRouter = require('./routes/trajectories');
const trajectoriesService = require('./services/trajectoriesService');

const app = express();
const PORT = 3000;

// Определяем путь к новому файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/trajectories.json');

// Инициализируем сервис
// Инициализируем сервис
trajectoriesService.init(DATA_FILE_PATH);

app.use(express.json());

// CORS middleware - разрешаем запросы с любого источника
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ГЛАВНОЕ ИЗМЕНЕНИЕ: теперь используем путь /trajectories
app.use('/trajectories', trajectoriesRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
