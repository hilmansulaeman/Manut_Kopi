const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const authorize = (requiredRoles) => {
    return async (req, res, next) => {
        // 1. Authenticate Token (already done in server.js, but good to ensure)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401); // No token

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(403); // Invalid token

            try {
                const user = await User.findById(decoded.user.id).populate('roles', 'name');
                if (!user) {
                    return res.status(403).json({ message: 'User not found' });
                }

                req.user = user; // Attach user object to request

                // 2. Check Roles
                const userRoles = user.roles.map(role => role.name);
                const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

                if (hasRequiredRole) {
                    next();
                } else {
                    res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
                }
            } catch (error) {
                console.error('Error in authorization middleware:', error);
                res.status(500).json({ message: 'Server error during authorization' });
            }
        });
    };
};

module.exports = authorize;
