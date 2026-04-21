const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');


router.get('/', stocksController.getAllStocks);
router.post('/', stocksController.createStock);
router.options('/', stocksController.optionsStocksCollection);

router.get('/:id', stocksController.getStockById);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);
router.put('/:id', stocksController.replaceStock);
router.head('/:id', stocksController.headStock);
router.options('/:id', stocksController.optionsStockResource); 

module.exports = router;
