const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: { // e.g., 'percentage_off', 'amount_off', 'buy_x_get_y'
        type: String,
        required: true
    },
    start_at: {
        type: Date,
        required: true
    },
    end_at: {
        type: Date,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
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
promotionSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Promotion', promotionSchema);
