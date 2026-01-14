const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().populate('parent_id', 'name');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent_id', 'name');
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one category
router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        parent_id: req.body.parent_id || null
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one category
router.patch('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (req.body.name != null) {
            category.name = req.body.name;
        }
        if (req.body.parent_id != null) {
            category.parent_id = req.body.parent_id;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Check if there are any subcategories
        const subCategories = await Category.find({ parent_id: req.params.id });
        if (subCategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with subcategories' });
        }

        await Category.deleteOne({ _id: req.params.id });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
