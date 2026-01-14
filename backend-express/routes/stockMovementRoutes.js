const express = require('express');
const router = express.Router();
const StockMovement = require('../models/StockMovement');

// Get all stock movements
router.get('/', async (req, res) => {
    try {
        const stockMovements = await StockMovement.find()
            .populate('product_id', 'name sku unit')
            .populate('outlet_id', 'name address');
        res.json(stockMovements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one stock movement
router.get('/:id', async (req, res) => {
    try {
        const stockMovement = await StockMovement.findById(req.params.id)
            .populate('product_id', 'name sku unit')
            .populate('outlet_id', 'name address');
        if (!stockMovement) return res.status(404).json({ message: 'Stock movement not found' });
        res.json(stockMovement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
