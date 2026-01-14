const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    adjusted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adjusted_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    reason: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);
