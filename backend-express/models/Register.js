const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    outlet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['idle', 'open', 'closed'],
        default: 'idle'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Register', registerSchema);
