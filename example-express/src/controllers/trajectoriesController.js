const trajectoriesService = require('../services/trajectoriesService');

const getAlltrajectories = (req, res) => {
    const { title } = req.query;
    const trajectories = trajectoriesService.findAll(title);
    res.json(trajectories);
};

const getTrajectoryById = (req, res) => {
    const id = parseInt(req.params.id);
    const Trajectory = trajectoriesService.findOne(id);

    if (!Trajectory) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(Trajectory);
};

const createTrajectory = (req, res) => {
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newTrajectory = trajectoriesService.create({ src, title, text });
    res.status(201).json(newTrajectory);
};

const updateTrajectory = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTrajectory = trajectoriesService.update(id, req.body);

    if (!updatedTrajectory) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(updatedTrajectory);
};

const deleteTrajectory = (req, res) => {
    const id = parseInt(req.params.id);
    const success = trajectoriesService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(204).send();
};


const replaceTrajectory = (req, res) => {
    const id = parseInt(req.params.id);
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Для PUT запроса необходимо передать все поля (src, title, text)' });
    }

    const replacedTrajectory = trajectoriesService.replace(id, { src, title, text });

    if (!replacedTrajectory) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(replacedTrajectory);
};

const headTrajectory = (req, res) => {
    const id = parseInt(req.params.id);
    const Trajectory = trajectoriesService.findOne(id);

    if (!Trajectory) {
        return res.status(404).end();
    }

    res.set('Content-Length', Buffer.byteLength(JSON.stringify(Trajectory)));
    res.status(200).end();
};

const optionstrajectoriesCollection = (req, res) => {
    res.set('Allow', 'GET, POST, OPTIONS');
    res.status(200).end();
};

const optionsTrajectoryResource = (req, res) => {
    res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.status(200).end();
};

module.exports = {
    getAlltrajectories,
    getTrajectoryById,
    createTrajectory,
    updateTrajectory,
    deleteTrajectory,
    replaceTrajectory,
    headTrajectory,
    optionstrajectoriesCollection,
    optionsTrajectoryResource
};
