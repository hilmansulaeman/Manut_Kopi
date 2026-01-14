const mongoose = require('mongoose');

const productStockSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    qty_on_hand: {
        type: Number,
        required: true,
        default: 0
    },
    min_stock: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique combination of product and outlet
productStockSchema.index({ product_id: 1, outlet_id: 1 }, { unique: true });

// Update `updated_at` timestamp on save
productStockSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('ProductStock', productStockSchema);
