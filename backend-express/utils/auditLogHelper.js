const AuditLog = require('../models/AuditLog');

const recordAuditLog = async (actorId, action, entity, entityId, metaJson, session) => {
    try {
        const newAuditLog = new AuditLog({
            actor_id: actorId,
            action,
            entity,
            entity_id: entityId,
            meta_json: metaJson,
            created_at: Date.now()
        });
        await newAuditLog.save({ session });
        console.log(`Audit log recorded: ${action} on ${entity} (ID: ${entityId}) by Actor: ${actorId}`);
    } catch (error) {
        console.error('Error recording audit log:', error);
        // Do not re-throw, audit logging should not block main operations
    }
};

module.exports = recordAuditLog;
