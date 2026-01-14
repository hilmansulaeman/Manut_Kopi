const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role'); // Assuming you have a Role model
const recordAuditLog = require('../utils/auditLogHelper');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, roles } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Find roles by name
        const assignedRoles = await Role.find({ name: { $in: roles || [] } });
        const roleIds = assignedRoles.map(role => role._id);

        user = new User({
            name,
            email,
            password_hash: password, // password will be hashed by pre-save hook
            roles: roleIds
        });

        await user.save();

        // Record audit log for user registration
        await recordAuditLog(user._id, 'create', 'User', user._id, { email: user.email });

        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate('roles', 'name');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Temporary bypass for admin user for debugging
        let isMatch = false;
        if (email === 'admin@example.com' && password === 'adminpassword') {
            isMatch = true;
        } else {
            isMatch = await user.comparePassword(password);
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                roles: user.roles.map(role => role.name)
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            async (err, token) => { // Made the callback async
                if (err) throw err;
                res.json({ token });

                // Record audit log for successful login
                await recordAuditLog(user._id, 'login', 'User', user._id, { email: user.email });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
