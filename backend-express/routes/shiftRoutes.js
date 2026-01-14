const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');
const Register = require('../models/Register');
const User = require('../models/User');

// Get all shifts
router.get('/', async (req, res) => {
    try {
        const shifts = await Shift.find()
            .populate('register_id', 'name outlet_id')
            .populate('opened_by', 'name email')
            .populate('closed_by', 'name email');
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one shift
router.get('/:id', async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id)
            .populate('register_id', 'name outlet_id')
            .populate('opened_by', 'name email')
            .populate('closed_by', 'name email');
        if (!shift) return res.status(404).json({ message: 'Shift not found' });
        res.json(shift);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Open a new shift
router.post('/open', async (req, res) => {
    const { register_id, opened_by, opening_cash } = req.body;

    // Validate register_id
    const register = await Register.findById(register_id);
    if (!register) {
        return res.status(400).json({ message: 'Invalid Register ID' });
    }

    // Validate opened_by
    const user = await User.findById(opened_by);
    if (!user) {
        return res.status(400).json({ message: 'Invalid User ID for opened_by' });
    }

    // Check if there's an open shift for this register
    const existingOpenShift = await Shift.findOne({ register_id, closed_at: null });
    if (existingOpenShift) {
        return res.status(400).json({ message: 'There is already an open shift for this register.' });
    }

    const shift = new Shift({
        register_id,
        opened_by,
        opened_at: Date.now(),
        opening_cash
    });
    try {
        const newShift = await shift.save();
        // Update register status to 'open'
        register.status = 'open';
        await register.save();
        res.status(201).json(newShift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Close an existing shift
router.patch('/close/:id', async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id);
        if (!shift) return res.status(404).json({ message: 'Shift not found' });
        if (shift.closed_at !== null) {
            return res.status(400).json({ message: 'Shift is already closed.' });
        }

        const { closed_by, closing_cash } = req.body;

        // Validate closed_by
        const user = await User.findById(closed_by);
        if (!user) {
            return res.status(400).json({ message: 'Invalid User ID for closed_by' });
        }

        shift.closed_by = closed_by;
        shift.closed_at = Date.now();
        shift.closing_cash = closing_cash;

        const updatedShift = await shift.save();

        // Update register status to 'idle'
        const register = await Register.findById(shift.register_id);
        if (register) {
            register.status = 'idle';
            await register.save();
        }

        res.json(updatedShift);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one shift (only if not closed)
router.delete('/:id', async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id);
        if (!shift) return res.status(404).json({ message: 'Shift not found' });
        if (shift.closed_at === null) {
            return res.status(400).json({ message: 'Cannot delete an open shift. Please close it first.' });
        }

        await Shift.deleteOne({ _id: req.params.id });
        res.json({ message: 'Shift deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
