const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find({ deleted_at: null });
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one supplier
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id, deleted_at: null });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one supplier
router.post('/', async (req, res) => {
    const supplier = new Supplier({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    });
    try {
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one supplier
router.patch('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id, deleted_at: null });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        if (req.body.name != null) supplier.name = req.body.name;
        if (req.body.phone != null) supplier.phone = req.body.phone;
        if (req.body.email != null) supplier.email = req.body.email;

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Soft delete one supplier
router.delete('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ _id: req.params.id, deleted_at: null });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.deleted_at = Date.now();
        await supplier.save();
        res.json({ message: 'Supplier soft deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
