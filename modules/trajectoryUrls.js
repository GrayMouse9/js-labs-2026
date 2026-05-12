class TrajectoryUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getTrajectories() {
        return `${this.baseUrl}/trajectories`;
    }
 
    getTrajectoryById(id) {
        return `${this.baseUrl}/trajectories/${id}`;
    }

    createTrajectory() {
        return `${this.baseUrl}/trajectories`;
    }

    removeTrajectoryById(id) {
        return `${this.baseUrl}/trajectories/${id}`;
    }

    updateTrajectoryById(id) {
        return `${this.baseUrl}/trajectories/${id}`;
    }
}

export const trajectoryUrls = new TrajectoryUrls();
