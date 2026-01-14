const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    register_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    shift_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    cashier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    invoice_no: {
        type: String
    },
    sold_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'voided'],
        default: 'completed'
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    discount_total: {
        type: Number,
        default: 0,
        min: 0
    },
    tax_total: {
        type: Number,
        default: 0,
        min: 0
    },
    grand_total: {
        type: Number,
        required: true,
        min: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sale', saleSchema);
