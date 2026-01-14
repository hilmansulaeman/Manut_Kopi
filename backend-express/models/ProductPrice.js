const mongoose = require('mongoose');

const productPriceSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique combination of product and outlet
productPriceSchema.index({ product_id: 1, outlet_id: 1 }, { unique: true });

module.exports = mongoose.model('ProductPrice', productPriceSchema);
