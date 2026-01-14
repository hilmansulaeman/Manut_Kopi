const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema({
    return_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Return',
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
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReturnItem', returnItemSchema);
