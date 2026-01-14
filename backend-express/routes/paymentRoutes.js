const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Sale = require('../models/Sale');
const PaymentMethod = require('../models/PaymentMethod');

// Get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('sale_id', 'invoice_no total grand_total')
            .populate('method_id', 'name type');
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one payment
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('sale_id', 'invoice_no total grand_total')
            .populate('method_id', 'name type');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one payment
router.post('/', async (req, res) => {
    const { sale_id, method_id, paid_amount, change_amount, reference_no } = req.body;

    // Validate sale_id
    const sale = await Sale.findById(sale_id);
    if (!sale) {
        return res.status(400).json({ message: 'Invalid Sale ID' });
    }

    // Validate method_id
    const paymentMethod = await PaymentMethod.findById(method_id);
    if (!paymentMethod) {
        return res.status(400).json({ message: 'Invalid Payment Method ID' });
    }

    const payment = new Payment({
        sale_id,
        method_id,
        paid_amount,
        change_amount,
        reference_no
    });
    try {
        const newPayment = await payment.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one payment (e.g., reference_no)
router.patch('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        if (req.body.method_id != null) {
            const paymentMethod = await PaymentMethod.findById(req.body.method_id);
            if (!paymentMethod) return res.status(400).json({ message: 'Invalid Payment Method ID' });
            payment.method_id = req.body.method_id;
        }
        if (req.body.paid_amount != null) payment.paid_amount = req.body.paid_amount;
        if (req.body.change_amount != null) payment.change_amount = req.body.change_amount;
        if (req.body.reference_no != null) payment.reference_no = req.body.reference_no;

        const updatedPayment = await payment.save();
        res.json(updatedPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one payment
router.delete('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        await Payment.deleteOne({ _id: req.params.id });
        res.json({ message: 'Payment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
