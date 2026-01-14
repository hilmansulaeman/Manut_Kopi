const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Can be null for system actions or unauthenticated access
    },
    action: { // e.g., 'create', 'update', 'delete', 'login', 'logout'
        type: String,
        required: true
    },
    entity: { // e.g., 'User', 'Product', 'Sale'
        type: String,
        required: true
    },
    entity_id: { // ID of the entity affected
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    meta_json: { // Additional metadata in JSON format
        type: mongoose.Schema.Types.Mixed, // Stores data of any type
        default: {}
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
