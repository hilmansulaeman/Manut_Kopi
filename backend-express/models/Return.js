const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['sales', 'purchase'],
        required: true
    },
    ref_sale_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        default: null
    },
    ref_purchase_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase',
        default: null
    },
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    processed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    returned_at: {
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

// Custom validation to ensure either ref_sale_id or ref_purchase_id is present based on type
returnSchema.pre('validate', function(next) {
    if (this.type === 'sales' && !this.ref_sale_id) {
        this.invalidate('ref_sale_id', 'ref_sale_id is required for sales returns.');
    }
    if (this.type === 'purchase' && !this.ref_purchase_id) {
        this.invalidate('ref_purchase_id', 'ref_purchase_id is required for purchase returns.');
    }
    if (this.type === 'sales' && this.ref_purchase_id) {
        this.invalidate('ref_purchase_id', 'ref_purchase_id should not be present for sales returns.');
    }
    if (this.type === 'purchase' && this.ref_sale_id) {
        this.invalidate('ref_sale_id', 'ref_sale_id should not be present for purchase returns.');
    }
    next();
});

module.exports = mongoose.model('Return', returnSchema);
