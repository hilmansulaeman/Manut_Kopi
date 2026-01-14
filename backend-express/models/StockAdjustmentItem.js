const mongoose = require('mongoose');

const stockAdjustmentItemSchema = new mongoose.Schema({
    stock_adjustment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StockAdjustment',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    delta_qty: { // Positive for increase, negative for decrease
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StockAdjustmentItem', stockAdjustmentItemSchema);
