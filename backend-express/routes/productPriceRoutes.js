const express = require('express');
const router = express.Router();
const ProductPrice = require('../models/ProductPrice');
const Product = require('../models/Product');
const Outlet = require('../models/Outlet');

// Get all product prices
router.get('/', async (req, res) => {
    try {
        const productPrices = await ProductPrice.find()
            .populate('product_id', 'name sku')
            .populate('outlet_id', 'name address');
        res.json(productPrices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one product price
router.get('/:id', async (req, res) => {
    try {
        const productPrice = await ProductPrice.findById(req.params.id)
            .populate('product_id', 'name sku')
            .populate('outlet_id', 'name address');
        if (!productPrice) return res.status(404).json({ message: 'Product price not found' });
        res.json(productPrice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one product price
router.post('/', async (req, res) => {
    const { product_id, outlet_id, price } = req.body;

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

    const productPrice = new ProductPrice({
        product_id,
        outlet_id,
        price
    });
    try {
        const newProductPrice = await productPrice.save();
        res.status(201).json(newProductPrice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one product price
router.patch('/:id', async (req, res) => {
    try {
        const productPrice = await ProductPrice.findById(req.params.id);
        if (!productPrice) return res.status(404).json({ message: 'Product price not found' });

        if (req.body.product_id != null) {
            const product = await Product.findById(req.body.product_id);
            if (!product) return res.status(400).json({ message: 'Invalid Product ID' });
            productPrice.product_id = req.body.product_id;
        }
        if (req.body.outlet_id != null) {
            const outlet = await Outlet.findById(req.body.outlet_id);
            if (!outlet) return res.status(400).json({ message: 'Invalid Outlet ID' });
            productPrice.outlet_id = req.body.outlet_id;
        }
        if (req.body.price != null) productPrice.price = req.body.price;

        const updatedProductPrice = await productPrice.save();
        res.json(updatedProductPrice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one product price
router.delete('/:id', async (req, res) => {
    try {
        const productPrice = await ProductPrice.findById(req.params.id);
        if (!productPrice) return res.status(404).json({ message: 'Product price not found' });

        await ProductPrice.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product price deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
