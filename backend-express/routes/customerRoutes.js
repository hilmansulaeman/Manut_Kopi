const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find({ deleted_at: null });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, deleted_at: null });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one customer
router.post('/', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        member_code: req.body.member_code,
        points: req.body.points
    });
    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one customer
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, deleted_at: null });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        if (req.body.name != null) customer.name = req.body.name;
        if (req.body.phone != null) customer.phone = req.body.phone;
        if (req.body.email != null) customer.email = req.body.email;
        if (req.body.member_code != null) customer.member_code = req.body.member_code;
        if (req.body.points != null) customer.points = req.body.points;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Soft delete one customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, deleted_at: null });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        customer.deleted_at = Date.now();
        await customer.save();
        res.json({ message: 'Customer soft deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
