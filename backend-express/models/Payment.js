const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    sale_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    method_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    paid_amount: {
        type: Number,
        required: true,
        min: 0
    },
    change_amount: {
        type: Number,
        default: 0
    },
    paid_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    reference_no: {
        type: String
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

// Update `updated_at` timestamp on save
paymentSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
