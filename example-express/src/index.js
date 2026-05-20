const express = require('express');
const path = require('path');
const trajectoriesRouter = require('./routes/trajectories');
const trajectoriesService = require('./services/trajectoriesService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/trajectories.json');

trajectoriesService.init(DATA_FILE_PATH);

app.use(express.json());
app.use('/img', express.static(path.join(__dirname, '..', '..', 'img')));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    const delay = parseInt(req.query.delay);
    if (delay > 0) {
        setTimeout(next, delay);
    } else {
        next();
    }
});

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
