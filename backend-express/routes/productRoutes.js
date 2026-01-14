const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Tax = require('../models/Tax');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category_id', 'name')
            .populate('tax_id', 'name rate_percent inclusive');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category_id', 'name')
            .populate('tax_id', 'name rate_percent inclusive');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one product
router.post('/', async (req, res) => {
    const { sku, name, category_id, unit, price, cost, tax_id, is_active } = req.body;

    // Validate category_id
    if (category_id) {
        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(400).json({ message: 'Invalid Category ID' });
        }
    }

    // Validate tax_id
    if (tax_id) {
        const tax = await Tax.findById(tax_id);
        if (!tax) {
            return res.status(400).json({ message: 'Invalid Tax ID' });
        }
    }

    const product = new Product({
        sku,
        name,
        category_id,
        unit,
        price,
        cost,
        tax_id,
        is_active
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one product
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.body.sku != null) product.sku = req.body.sku;
        if (req.body.name != null) product.name = req.body.name;
        if (req.body.category_id != null) {
            const category = await Category.findById(req.body.category_id);
            if (!category) return res.status(400).json({ message: 'Invalid Category ID' });
            product.category_id = req.body.category_id;
        }
        if (req.body.unit != null) product.unit = req.body.unit;
        if (req.body.price != null) product.price = req.body.price;
        if (req.body.cost != null) product.cost = req.body.cost;
        if (req.body.tax_id != null) {
            const tax = await Tax.findById(req.body.tax_id);
            if (!tax) return res.status(400).json({ message: 'Invalid Tax ID' });
            product.tax_id = req.body.tax_id;
        }
        if (req.body.is_active != null) product.is_active = req.body.is_active;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
