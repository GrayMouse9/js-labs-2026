const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const trajectories = fileService.readData(dataFilePath);
    if (title) {
        return trajectories.filter(Trajectory =>
            Trajectory.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return trajectories;
};

const findOne = (id) => {
    const trajectories = fileService.readData(dataFilePath);
    return trajectories.find(Trajectory => Trajectory.id === id);
};

const create = (TrajectoryData) => {
    const trajectories = fileService.readData(dataFilePath);

    const newId = trajectories.length > 0
        ? Math.max(...trajectories.map(s => s.id)) + 1
        : 1;

    const newTrajectory = { id: newId, ...TrajectoryData };
    trajectories.push(newTrajectory);
    fileService.writeData(dataFilePath, trajectories);

    return newTrajectory;
};

const update = (id, TrajectoryData) => {
    const trajectories = fileService.readData(dataFilePath);
    const index = trajectories.findIndex(s => s.id === id);

    if (index === -1) return null;

    trajectories[index] = { ...trajectories[index], ...TrajectoryData };
    fileService.writeData(dataFilePath, trajectories);

    return trajectories[index];
};

const remove = (id) => {
    const trajectories = fileService.readData(dataFilePath);
    const filteredtrajectories = trajectories.filter(s => s.id !== id);

    if (filteredtrajectories.length === trajectories.length) {
        return false;
    }

    fileService.writeData(dataFilePath, filteredtrajectories);
    return true;
};

const replace = (id, TrajectoryData) => {
    const trajectories = fileService.readData(dataFilePath);
    const index = trajectories.findIndex(s => s.id === id);

    if (index === -1) return null;

    trajectories[index] = { id, ...TrajectoryData };
    fileService.writeData(dataFilePath, trajectories);

    return trajectories[index];
};

module.exports = { init, findAll, findOne, create, update, replace, remove };
