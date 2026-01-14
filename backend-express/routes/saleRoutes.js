const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Outlet = require('../models/Outlet');
const Register = require('../models/Register');
const Shift = require('../models/Shift');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const ProductStock = require('../models/ProductStock'); // For updating stock
const recordStockMovement = require('../utils/stockMovementHelper');

// Get all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('outlet_id', 'name address')
            .populate('register_id', 'name')
            .populate('shift_id', 'opened_at closed_at')
            .populate('cashier_id', 'name email')
            .populate('customer_id', 'name member_code');
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one sale with its items
router.get('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('outlet_id', 'name address')
            .populate('register_id', 'name')
            .populate('shift_id', 'opened_at closed_at')
            .populate('cashier_id', 'name email')
            .populate('customer_id', 'name member_code');
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        const saleItems = await SaleItem.find({ sale_id: req.params.id })
            .populate('product_id', 'name sku unit');

        res.json({ sale, items: saleItems });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new sale with items
router.post('/', async (req, res) => {
    const { outlet_id, register_id, shift_id, cashier_id, customer_id, invoice_no, sold_at, status, total, discount_total, tax_total, grand_total, items } = req.body;

    // Basic validations
    const outlet = await Outlet.findById(outlet_id);
    if (!outlet) return res.status(400).json({ message: 'Invalid Outlet ID' });
    const register = await Register.findById(register_id);
    if (!register) return res.status(400).json({ message: 'Invalid Register ID' });
    const shift = await Shift.findById(shift_id);
    if (!shift) return res.status(400).json({ message: 'Invalid Shift ID' });
    const cashier = await User.findById(cashier_id);
    if (!cashier) return res.status(400).json({ message: 'Invalid Cashier ID' });
    if (customer_id) {
        const customer = await Customer.findById(customer_id);
        if (!customer) return res.status(400).json({ message: 'Invalid Customer ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newSale = new Sale({
            outlet_id, register_id, shift_id, cashier_id, customer_id, invoice_no, sold_at, status, total, discount_total, tax_total, grand_total
        });
        await newSale.save({ session });

        const saleItems = [];
        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }

            // Update product stock
            const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id });
            if (!productStock || productStock.qty_on_hand < item.qty) {
                throw new Error(`Insufficient stock for product ${product.name} at this outlet.`);
            }
            productStock.qty_on_hand -= item.qty;
            await productStock.save({ session });
            await recordStockMovement(item.product_id, outlet_id, 'sale', newSale._id, -item.qty, session);

            const newSaleItem = new SaleItem({
                sale_id: newSale._id,
                product_id: item.product_id,
                qty: item.qty,
                price: item.price,
                discount_amount: item.discount_amount,
                tax_amount: item.tax_amount,
                subtotal: item.subtotal,
                applied_tax_rate: item.applied_tax_rate,
                tax_inclusive: item.tax_inclusive,
                unit_price_before_discount: item.unit_price_before_discount
            });
            saleItems.push(newSaleItem);
        }

        await SaleItem.insertMany(saleItems, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ sale: newSale, items: saleItems });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update sale status (e.g., to cancelled or voided)
router.patch('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        if (req.body.status != null) {
            // Add logic for stock reversal if status changes to cancelled/voided
            if ((sale.status === 'completed' || sale.status === 'pending') && (req.body.status === 'cancelled' || req.body.status === 'voided')) {
                const saleItems = await SaleItem.find({ sale_id: req.params.id });
                for (const item of saleItems) {
                    const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id: sale.outlet_id });
                    if (productStock) {
                        productStock.qty_on_hand += item.qty;
                        await productStock.save();
                        await recordStockMovement(item.product_id, sale.outlet_id, 'sale_revert', sale._id, item.qty, null);
                    }
                }
            }
            sale.status = req.body.status;
        }
        // Add other updatable fields as needed

        const updatedSale = await sale.save();
        res.json(updatedSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a sale (and its items)
router.delete('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        // Revert stock if sale was completed
        if (sale.status === 'completed') {
            const saleItems = await SaleItem.find({ sale_id: req.params.id });
            for (const item of saleItems) {
                const productStock = await ProductStock.findOne({ product_id: item.product_id, outlet_id: sale.outlet_id });
                if (productStock) {
                    productStock.qty_on_hand += item.qty;
                    await productStock.save({ session });
                    await recordStockMovement(item.product_id, sale.outlet_id, 'sale_delete_revert', sale._id, item.qty, session);
                }
            }
        }

        await SaleItem.deleteMany({ sale_id: req.params.id }, { session });
        await Sale.deleteOne({ _id: req.params.id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Sale and its items deleted' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
