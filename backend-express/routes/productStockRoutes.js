const express = require('express');
const router = express.Router();
const ProductStock = require('../models/ProductStock');
const Product = require('../models/Product');
const Outlet = require('../models/Outlet');

// Get all product stocks
router.get('/', async (req, res) => {
    try {
        const productStocks = await ProductStock.find()
            .populate('product_id', 'name sku')
            .populate('outlet_id', 'name address');
        res.json(productStocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one product stock
router.get('/:id', async (req, res) => {
    try {
        const productStock = await ProductStock.findById(req.params.id)
            .populate('product_id', 'name sku')
            .populate('outlet_id', 'name address');
        if (!productStock) return res.status(404).json({ message: 'Product stock not found' });
        res.json(productStock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one product stock
router.post('/', async (req, res) => {
    const { product_id, outlet_id, qty_on_hand, min_stock } = req.body;

    // Validate product_id
    const product = await Product.findById(product_id);
    if (!product) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // Validate outlet_id
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) {
        return res.status(400).json({ message: 'Invalid Outlet ID' });
    }

    const productStock = new ProductStock({
        product_id,
        outlet_id,
        qty_on_hand,
        min_stock
    });
    try {
        const newProductStock = await productStock.save();
        res.status(201).json(newProductStock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one product stock
router.patch('/:id', async (req, res) => {
    try {
        const productStock = await ProductStock.findById(req.params.id);
        if (!productStock) return res.status(404).json({ message: 'Product stock not found' });

        if (req.body.product_id != null) {
            const product = await Product.findById(req.body.product_id);
            if (!product) return res.status(400).json({ message: 'Invalid Product ID' });
            productStock.product_id = req.body.product_id;
        }
        if (req.body.outlet_id != null) {
            const outlet = await Outlet.findById(req.body.outlet_id);
            if (!outlet) return res.status(400).json({ message: 'Invalid Outlet ID' });
            productStock.outlet_id = req.body.outlet_id;
        }
        if (req.body.qty_on_hand != null) productStock.qty_on_hand = req.body.qty_on_hand;
        if (req.body.min_stock != null) productStock.min_stock = req.body.min_stock;

        const updatedProductStock = await productStock.save();
        res.json(updatedProductStock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one product stock
router.delete('/:id', async (req, res) => {
    try {
        const productStock = await ProductStock.findById(req.params.id);
        if (!productStock) return res.status(404).json({ message: 'Product stock not found' });

        await ProductStock.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product stock deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
