const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const ReturnItem = require('../models/ReturnItem');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Outlet = require('../models/Outlet');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock'); // For updating stock
const recordStockMovement = require('../utils/stockMovementHelper');

// Get all returns
router.get('/', async (req, res) => {
    try {
        const returns = await Return.find()
            .populate('ref_sale_id', 'invoice_no')
            .populate('ref_purchase_id', 'invoice_no')
            .populate('outlet_id', 'name address')
            .populate('processed_by', 'name email');
        res.json(returns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one return with its items
router.get('/:id', async (req, res) => {
    try {
        const singleReturn = await Return.findById(req.params.id)
            .populate('ref_sale_id', 'invoice_no')
            .populate('ref_purchase_id', 'invoice_no')
            .populate('outlet_id', 'name address')
            .populate('processed_by', 'name email');
        if (!singleReturn) return res.status(404).json({ message: 'Return not found' });

        const returnItems = await ReturnItem.find({ return_id: req.params.id })
            .populate('product_id', 'name sku unit');

        res.json({ return: singleReturn, items: returnItems });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new return with items
router.post('/', async (req, res) => {
    const { type, ref_sale_id, ref_purchase_id, outlet_id, processed_by, reason, items } = req.body;

    // Validate references
    if (type === 'sales' && !ref_sale_id) return res.status(400).json({ message: 'ref_sale_id is required for sales returns.' });
    if (type === 'purchase' && !ref_purchase_id) return res.status(400).json({ message: 'ref_purchase_id is required for purchase returns.' });
    if (type === 'sales' && ref_purchase_id) return res.status(400).json({ message: 'ref_purchase_id should not be present for sales returns.' });
    if (type === 'purchase' && ref_sale_id) return res.status(400).json({ message: 'ref_sale_id should not be present for purchase returns.' });

    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) return res.status(400).json({ message: 'Invalid Outlet ID' });
    const user = await User.findById(processed_by);
    if (!user) return res.status(400).json({ message: 'Invalid User ID for processed_by' });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newReturn = new Return({
            type, ref_sale_id, ref_purchase_id, outlet_id, processed_by, reason, returned_at: Date.now()
        });
        await newReturn.save({ session });

        const returnItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }

            // Update product stock based on return type
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id });
            if (!productStock) {
                throw new Error(`Product stock not found for product ${product.name} at this outlet.`);
            }

            if (type === 'sales') { // Item returned to stock
                productStock.qty_on_hand += item.qty;
                await productStock.save({ session });
                await recordStockMovement(item.product_id, outlet_id, 'return_sales', newReturn._id, item.qty, session);
            } else if (type === 'purchase') { // Item returned to supplier, so decrease stock
                if (productStock.qty_on_hand < item.qty) {
                    throw new Error(`Insufficient stock to return product ${product.name} to supplier.`);
                }
                productStock.qty_on_hand -= item.qty;
                await productStock.save({ session });
                await recordStockMovement(item.product_id, outlet_id, 'return_purchase', newReturn._id, -item.qty, session);
            }

            const newReturnItem = new ReturnItem({
                return_id: newReturn._id,
                product_id: item.product_id,
                qty: item.qty,
                amount: item.amount
            });
            returnItems.push(newReturnItem);
        }

        await ReturnItem.insertMany(returnItems, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ return: newReturn, items: returnItems });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a return (and its items) - this might require reversing stock changes
router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const singleReturn = await Return.findById(req.params.id);
        if (!singleReturn) return res.status(404).json({ message: 'Return not found' });

        const returnItems = await ReturnItem.find({ return_id: req.params.id });

        // Revert stock changes
        for (const item of returnItems) {
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id: singleReturn.outlet_id });
            if (productStock) {
                if (singleReturn.type === 'sales') { // Item was returned to stock, so remove from stock
                    if (productStock.qty_on_hand < item.qty) {
                        throw new Error(`Cannot delete return: insufficient stock to revert for product ${item.product_id}.`);
                    }
                    productStock.qty_on_hand -= item.qty;
                    await productStock.save({ session });
                    await recordStockMovement(item.product_id, singleReturn.outlet_id, 'return_sales_delete_revert', singleReturn._id, -item.qty, session);
                } else if (singleReturn.type === 'purchase') { // Item was returned to supplier, so add back to stock
                    productStock.qty_on_hand += item.qty;
                    await productStock.save({ session });
                    await recordStockMovement(item.product_id, singleReturn.outlet_id, 'return_purchase_delete_revert', singleReturn._id, item.qty, session);
                }
            }
        }

        await ReturnItem.deleteMany({ return_id: req.params.id }, { session });
        await Return.deleteOne({ _id: req.params.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Return and its items deleted' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
