const express = require('express');
const router = express.Router();
const Register = require('../models/Register');
const Outlet = require('../models/Outlet'); // To populate outlet details

// Get all registers
router.get('/', async (req, res) => {
    try {
        const registers = await Register.find().populate('outlet_id', 'name address');
        res.json(registers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one register
router.get('/:id', async (req, res) => {
    try {
        const register = await Register.findById(req.params.id).populate('outlet_id', 'name address');
        if (!register) return res.status(404).json({ message: 'Register not found' });
        res.json(register);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one register
router.post('/', async (req, res) => {
    const { outlet_id, name, status } = req.body;

    // Validate outlet_id
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) {
        return res.status(400).json({ message: 'Invalid Outlet ID' });
    }

    const register = new Register({
        outlet_id,
        name,
        status
    });
    try {
        const newRegister = await register.save();
        res.status(201).json(newRegister);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one register
router.patch('/:id', async (req, res) => {
    try {
        const register = await Register.findById(req.params.id);
        if (!register) return res.status(404).json({ message: 'Register not found' });

        if (req.body.outlet_id != null) {
            const outlet = await Outlet.findById(req.body.outlet_id);
            if (!outlet) {
                return res.status(400).json({ message: 'Invalid Outlet ID' });
            }
            register.outlet_id = req.body.outlet_id;
        }
        if (req.body.name != null) {
            register.name = req.body.name;
        }
        if (req.body.status != null) {
            register.status = req.body.status;
        }

        const updatedRegister = await register.save();
        res.json(updatedRegister);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one register
router.delete('/:id', async (req, res) => {
    try {
        const register = await Register.findById(req.params.id);
        if (!register) return res.status(404).json({ message: 'Register not found' });

        await Register.deleteOne({ _id: req.params.id });
        res.json({ message: 'Register deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
