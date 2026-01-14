const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const PromotionRule = require('../models/PromotionRule');
const Product = require('../models/Product');

// Get all promotions
router.get('/', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one promotion with its rules
router.get('/:id', async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

        const rules = await PromotionRule.find({ promotion_id: req.params.id })
            .populate('product_id', 'name sku');

        res.json({ promotion, rules });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create one promotion with rules
router.post('/', async (req, res) => {
    const { name, type, start_at, end_at, is_active, rules } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newPromotion = new Promotion({
            name, type, start_at, end_at, is_active
        });
        await newPromotion.save({ session });

        const promotionRules = [];
        for (const rule of rules) {
            if (rule.product_id) {
                const product = await Product.findById(rule.product_id);
                if (!product) {
                    throw new Error(`Product with ID ${rule.product_id} not found for a promotion rule.`);
                }
            }
            const newRule = new PromotionRule({
                promotion_id: newPromotion._id,
                product_id: rule.product_id || null,
                min_qty: rule.min_qty,
                percent_off: rule.percent_off,
                amount_off: rule.amount_off
            });
            promotionRules.push(newRule);
        }

        await PromotionRule.insertMany(promotionRules, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ promotion: newPromotion, rules: promotionRules });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update one promotion
router.patch('/:id', async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

        if (req.body.name != null) promotion.name = req.body.name;
        if (req.body.type != null) promotion.type = req.body.type;
        if (req.body.start_at != null) promotion.start_at = req.body.start_at;
        if (req.body.end_at != null) promotion.end_at = req.body.end_at;
        if (req.body.is_active != null) promotion.is_active = req.body.is_active;

        const updatedPromotion = await promotion.save();
        res.json(updatedPromotion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one promotion (and its rules)
router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion) return res.status(404).json({ message: 'Promotion not found' });

        await PromotionRule.deleteMany({ promotion_id: req.params.id }, { session });
        await Promotion.deleteOne({ _id: req.params.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Promotion and its rules deleted' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
