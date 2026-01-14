const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    shift_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
        default: null
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    noted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    spent_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    note: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
