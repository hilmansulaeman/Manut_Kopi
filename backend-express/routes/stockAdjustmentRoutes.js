const express = require('express');
const router = express.Router();
const StockAdjustment = require('../models/StockAdjustment');
const StockAdjustmentItem = require('../models/StockAdjustmentItem');
const Outlet = require('../models/Outlet');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock'); // For updating stock
const recordStockMovement = require('../utils/stockMovementHelper');

// Get all stock adjustments
router.get('/', async (req, res) => {
    try {
        const stockAdjustments = await StockAdjustment.find()
            .populate('outlet_id', 'name address')
            .populate('adjusted_by', 'name email');
        res.json(stockAdjustments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one stock adjustment with its items
router.get('/:id', async (req, res) => {
    try {
        const stockAdjustment = await StockAdjustment.findById(req.params.id)
            .populate('outlet_id', 'name address')
            .populate('adjusted_by', 'name email');
        if (!stockAdjustment) return res.status(404).json({ message: 'Stock adjustment not found' });

        const stockAdjustmentItems = await StockAdjustmentItem.find({ stock_adjustment_id: req.params.id })
            .populate('product_id', 'name sku unit');

        res.json({ stockAdjustment, items: stockAdjustmentItems });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new stock adjustment with items
router.post('/', async (req, res) => {
    const { outlet_id, adjusted_by, reason, items } = req.body;

    // Validate outlet_id
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) {
        return res.status(400).json({ message: 'Invalid Outlet ID' });
    }

    // Validate adjusted_by
    const user = await User.findById(adjusted_by);
    if (!user) {
        return res.status(400).json({ message: 'Invalid User ID for adjusted_by' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newStockAdjustment = new StockAdjustment({
            outlet_id,
            adjusted_by,
            adjusted_at: Date.now(),
            reason
        });
        await newStockAdjustment.save({ session });

        const stockAdjustmentItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }

            // Update product stock
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id });
            if (!productStock) {
                throw new Error(`Product stock not found for product ${product.name} at this outlet.`);
            }

            productStock.qty_on_hand += item.delta_qty;
            if (productStock.qty_on_hand < 0) {
                throw new Error(`Stock for product ${product.name} cannot go below zero.`);
            }
            await productStock.save({ session });
            await recordStockMovement(item.product_id, outlet_id, 'stock_adjustment', newStockAdjustment._id, item.delta_qty, session);

            const newStockAdjustmentItem = new StockAdjustmentItem({
                stock_adjustment_id: newStockAdjustment._id,
                product_id: item.product_id,
                delta_qty: item.delta_qty
            });
            stockAdjustmentItems.push(newStockAdjustmentItem);
        }

        await StockAdjustmentItem.insertMany(stockAdjustmentItems, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ stockAdjustment: newStockAdjustment, items: stockAdjustmentItems });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a stock adjustment (and its items) - this might require reversing stock changes
router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const stockAdjustment = await StockAdjustment.findById(req.params.id);
        if (!stockAdjustment) return res.status(404).json({ message: 'Stock adjustment not found' });

        const stockAdjustmentItems = await StockAdjustmentItem.find({ stock_adjustment_id: req.params.id });

        // Revert stock changes
        for (const item of stockAdjustmentItems) {
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id: stockAdjustment.outlet_id });
            if (productStock) {
                productStock.qty_on_hand -= item.delta_qty; // Reverse the delta
                if (productStock.qty_on_hand < 0) {
                    throw new Error(`Cannot delete adjustment: reverting stock for product ${item.product_id} would result in negative stock.`);
                }
                await productStock.save({ session });
                await recordStockMovement(item.product_id, stockAdjustment.outlet_id, 'stock_adjustment_revert', stockAdjustment._id, -item.delta_qty, session);
            }
        }

        await StockAdjustmentItem.deleteMany({ stock_adjustment_id: req.params.id }, { session });
        await StockAdjustment.deleteOne({ _id: req.params.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Stock adjustment and its items deleted' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
