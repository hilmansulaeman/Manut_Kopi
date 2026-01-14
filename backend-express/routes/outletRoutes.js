const express = require('express');
const router = express.Router();
const Outlet = require('../models/Outlet');

// Get all outlets
router.get('/', async (req, res) => {
    try {
        const outlets = await Outlet.find();
        res.json(outlets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one outlet
router.get('/:id', async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) return res.status(404).json({ message: 'Outlet not found' });
        res.json(outlet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one outlet
router.post('/', async (req, res) => {
    const outlet = new Outlet({
        name: req.body.name,
        address: req.body.address
    });
    try {
        const newOutlet = await outlet.save();
        res.status(201).json(newOutlet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one outlet
router.patch('/:id', async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

        if (req.body.name != null) {
            outlet.name = req.body.name;
        }
        if (req.body.address != null) {
            outlet.address = req.body.address;
        }

        const updatedOutlet = await outlet.save();
        res.json(updatedOutlet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one outlet
router.delete('/:id', async (req, res) => {
    try {
        const outlet = await Outlet.findById(req.params.id);
        if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

        await Outlet.deleteOne({ _id: req.params.id });
        res.json({ message: 'Outlet deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
