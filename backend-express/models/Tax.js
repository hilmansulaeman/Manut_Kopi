const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rate_percent: {
        type: Number,
        required: true
    },
    inclusive: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tax', taxSchema);
