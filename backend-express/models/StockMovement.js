const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
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
    source_type: { // e.g., 'purchase', 'sale', 'return', 'stock_adjustment'
        type: String,
        required: true
    },
    source_id: { // ID of the related purchase, sale, return, or stock adjustment
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    qty_in: {
        type: Number,
        default: 0,
        min: 0
    },
    qty_out: {
        type: Number,
        default: 0,
        min: 0
    },
    balance_after: {
        type: Number,
        required: true
    },
    moved_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);
