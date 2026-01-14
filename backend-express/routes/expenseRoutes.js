const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Outlet = require('../models/Outlet');
const Shift = require('../models/Shift');
const User = require('../models/User');

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('outlet_id', 'name address')
            .populate('shift_id', 'opened_at closed_at')
            .populate('noted_by', 'name email');
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one expense
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('outlet_id', 'name address')
            .populate('shift_id', 'opened_at closed_at')
            .populate('noted_by', 'name email');
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one expense
router.post('/', async (req, res) => {
    const { outlet_id, shift_id, category, amount, noted_by, note } = req.body;

    // Validate outlet_id
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) {
        return res.status(400).json({ message: 'Invalid Outlet ID' });
    }

    // Validate shift_id (optional)
    if (shift_id) {
        const shift = await Shift.findById(shift_id);
        if (!shift) {
            return res.status(400).json({ message: 'Invalid Shift ID' });
        }
    }

    // Validate noted_by
    const user = await User.findById(noted_by);
    if (!user) {
        return res.status(400).json({ message: 'Invalid User ID for noted_by' });
    }

    const expense = new Expense({
        outlet_id,
        shift_id,
        category,
        amount,
        noted_by,
        spent_at: Date.now(),
        note
    });
    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one expense
router.patch('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (req.body.outlet_id != null) {
            const outlet = await Outlet.findById(req.body.outlet_id);
            if (!outlet) return res.status(400).json({ message: 'Invalid Outlet ID' });
            expense.outlet_id = req.body.outlet_id;
        }
        if (req.body.shift_id != null) {
            const shift = await Shift.findById(req.body.shift_id);
            if (!shift) return res.status(400).json({ message: 'Invalid Shift ID' });
            expense.shift_id = req.body.shift_id;
        }
        if (req.body.category != null) expense.category = req.body.category;
        if (req.body.amount != null) expense.amount = req.body.amount;
        if (req.body.noted_by != null) {
            const user = await User.findById(req.body.noted_by);
            if (!user) return res.status(400).json({ message: 'Invalid User ID for noted_by' });
            expense.noted_by = req.body.noted_by;
        }
        if (req.body.note != null) expense.note = req.body.note;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one expense
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        await Expense.deleteOne({ _id: req.params.id });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
