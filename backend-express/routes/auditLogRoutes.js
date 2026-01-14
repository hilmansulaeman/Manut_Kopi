const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const authorize = require('../middleware/rbac'); // Correctly import authorize

module.exports = (authenticateToken) => { // Export a function that takes authenticateToken
    // Get all audit logs (requires admin role)
    router.get('/', authenticateToken, authorize(['Admin']), async (req, res) => {
        try {
            const auditLogs = await AuditLog.find()
                .populate('actor_id', 'name email') // Populate actor details
                .sort({ created_at: -1 }); // Sort by most recent
            res.json(auditLogs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Get a single audit log by ID (requires admin role)
    router.get('/:id', authenticateToken, authorize(['Admin']), async (req, res) => {
        try {
            const auditLog = await AuditLog.findById(req.params.id)
                .populate('actor_id', 'name email');
            if (!auditLog) {
                return res.status(404).json({ message: 'Audit log not found' });
            }
            res.json(auditLog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
