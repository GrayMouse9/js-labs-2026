const express = require('express');
const router = express.Router();
const trajectoriesController = require('../controllers/trajectoriesController');


router.get('/', trajectoriesController.getAlltrajectories);
router.post('/', trajectoriesController.createTrajectory);
router.options('/', trajectoriesController.optionstrajectoriesCollection);

router.get('/:id', trajectoriesController.getTrajectoryById);
router.patch('/:id', trajectoriesController.updateTrajectory);
router.delete('/:id', trajectoriesController.deleteTrajectory);
router.put('/:id', trajectoriesController.replaceTrajectory);
router.head('/:id', trajectoriesController.headTrajectory);
router.options('/:id', trajectoriesController.optionsTrajectoryResource);

module.exports = router;
