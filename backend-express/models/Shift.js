const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    register_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    opened_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    closed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    opened_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    closed_at: {
        type: Date,
        default: null
    },
    opening_cash: {
        type: Number,
        default: 0
    },
    closing_cash: {
        type: Number,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shift', shiftSchema);
