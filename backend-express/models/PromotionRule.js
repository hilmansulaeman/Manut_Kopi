const mongoose = require('mongoose');

const promotionRuleSchema = new mongoose.Schema({
    promotion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null // Can be null if the promotion applies to all products
    },
    min_qty: {
        type: Number,
        default: 0
    },
    percent_off: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    amount_off: {
        type: Number,
        default: 0,
        min: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PromotionRule', promotionRuleSchema);
