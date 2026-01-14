const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
    purchase_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
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
    cost: {
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
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);
