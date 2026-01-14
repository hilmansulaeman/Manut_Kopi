const express = require('express');
const router = express.Router();
const Tax = require('../models/Tax');

// Get all taxes
router.get('/', async (req, res) => {
    try {
        const taxes = await Tax.find();
        res.json(taxes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one tax
router.get('/:id', async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id);
        if (!tax) return res.status(404).json({ message: 'Tax not found' });
        res.json(tax);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one tax
router.post('/', async (req, res) => {
    const tax = new Tax({
        name: req.body.name,
        rate_percent: req.body.rate_percent,
        inclusive: req.body.inclusive
    });
    try {
        const newTax = await tax.save();
        res.status(201).json(newTax);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one tax
router.patch('/:id', async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id);
        if (!tax) return res.status(404).json({ message: 'Tax not found' });

        if (req.body.name != null) {
            tax.name = req.body.name;
        }
        if (req.body.rate_percent != null) {
            tax.rate_percent = req.body.rate_percent;
        }
        if (req.body.inclusive != null) {
            tax.inclusive = req.body.inclusive;
        }

        const updatedTax = await tax.save();
        res.json(updatedTax);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one tax
router.delete('/:id', async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id);
        if (!tax) return res.status(404).json({ message: 'Tax not found' });

        await Tax.deleteOne({ _id: req.params.id });
        res.json({ message: 'Tax deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
