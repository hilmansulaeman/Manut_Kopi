const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    sale_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount_amount: {
        type: Number,
        default: 0,
        min: 0
    },
    tax_amount: {
        type: Number,
        default: 0,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    applied_tax_rate: {
        type: Number,
        default: null
    },
    tax_inclusive: {
        type: Boolean,
        default: false
    },
    unit_price_before_discount: {
        type: Number,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SaleItem', saleItemSchema);
