const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const PurchaseItem = require('../models/PurchaseItem');
const Supplier = require('../models/Supplier');
const Outlet = require('../models/Outlet');
const Product = require('../models/Product');
const recordStockMovement = require('../utils/stockMovementHelper');

// Get all purchases
router.get('/', async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('supplier_id', 'name')
            .populate('outlet_id', 'name address');
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one purchase with its items
router.get('/:id', async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id)
            .populate('supplier_id', 'name')
            .populate('outlet_id', 'name address');
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        const purchaseItems = await PurchaseItem.find({ purchase_id: req.params.id })
            .populate('product_id', 'name sku unit');

        res.json({ purchase, items: purchaseItems });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new purchase with items
router.post('/', async (req, res) => {
    const { supplier_id, outlet_id, invoice_no, purchased_at, status, items } = req.body;

    // Validate supplier_id
    if (supplier_id) {
        const supplier = await Supplier.findById(supplier_id);
        if (!supplier) {
            return res.status(400).json({ message: 'Invalid Supplier ID' });
        }
    }

    // Validate outlet_id
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) {
        return res.status(400).json({ message: 'Invalid Outlet ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newPurchase = new Purchase({
            supplier_id,
            outlet_id,
            invoice_no,
            purchased_at,
            status
        });
        await newPurchase.save({ session });

        const purchaseItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }

            const newPurchaseItem = new PurchaseItem({
                purchase_id: newPurchase._id,
                product_id: item.product_id,
                qty: item.qty,
                cost: item.cost,
                discount_amount: item.discount_amount,
                tax_amount: item.tax_amount,
                subtotal: item.subtotal
            });
            purchaseItems.push(newPurchaseItem);
        }

        await PurchaseItem.insertMany(purchaseItems, { session });

        // Record stock movements for each item
        for (const item of items) {
            await recordStockMovement(item.product_id, outlet_id, 'purchase', newPurchase._id, item.qty, session);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ purchase: newPurchase, items: purchaseItems });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update purchase status (e.g., to cancelled)
router.patch('/:id', async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        if (req.body.status != null) {
            purchase.status = req.body.status;
        }
        // Add other updatable fields as needed

        const updatedPurchase = await purchase.save();
        res.json(updatedPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a purchase (and its items)
router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        const purchaseItems = await PurchaseItem.find({ purchase_id: req.params.id });

        // Revert stock movements and update ProductStock
        for (const item of purchaseItems) {
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id: purchase.outlet_id });
            if (productStock) {
                productStock.qty_on_hand -= item.qty; // Reverse the stock increase from purchase
                await productStock.save({ session });
                await recordStockMovement(item.product_id, purchase.outlet_id, 'purchase_revert', purchase._id, -item.qty, session);
            }
        }

        await PurchaseItem.deleteMany({ purchase_id: req.params.id }, { session });
        await Purchase.deleteOne({ _id: req.params.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Purchase and its items deleted' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
