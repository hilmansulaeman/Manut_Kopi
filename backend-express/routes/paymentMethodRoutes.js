const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');

// Get all payment methods
router.get('/', async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find();
        res.json(paymentMethods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one payment method
router.get('/:id', async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });
        res.json(paymentMethod);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one payment method
router.post('/', async (req, res) => {
    const paymentMethod = new PaymentMethod({
        name: req.body.name,
        type: req.body.type
    });
    try {
        const newPaymentMethod = await paymentMethod.save();
        res.status(201).json(newPaymentMethod);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one payment method
router.patch('/:id', async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });

        if (req.body.name != null) paymentMethod.name = req.body.name;
        if (req.body.type != null) paymentMethod.type = req.body.type;

        const updatedPaymentMethod = await paymentMethod.save();
        res.json(updatedPaymentMethod);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one payment method
router.delete('/:id', async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });

        await PaymentMethod.deleteOne({ _id: req.params.id });
        res.json({ message: 'Payment method deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
