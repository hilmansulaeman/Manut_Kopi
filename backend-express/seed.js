require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');
const User = require('./models/User'); // Assuming User model is also needed for admin creation

const uri = process.env.MONGODB_URI;

const seedRoles = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected for seeding');

        const rolesToSeed = ['Cashier', 'Warehouse', 'Admin', 'Manager'];
        const existingRoles = await Role.find({});
        const existingRoleNames = existingRoles.map(role => role.name);

        for (const roleName of rolesToSeed) {
            if (!existingRoleNames.includes(roleName)) {
                await Role.create({ name: roleName });
                console.log(`Role '${roleName}' seeded.`);
            } else {
                console.log(`Role '${roleName}' already exists.`);
            }
        }

        // Optional: Create an admin user if one doesn't exist
        const adminRole = await Role.findOne({ name: 'Admin' });
        if (adminRole) {
            const adminUser = await User.findOne({ email: 'admin@example.com' });
            if (!adminUser) {
                const newAdmin = new User({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password_hash: 'adminpassword', // This will be hashed by the pre-save hook
                    roles: [adminRole._id]
                });
                await newAdmin.save();
                console.log('Admin user created.');
            } else {
                console.log('Admin user already exists.');
            }
        }


    } catch (error) {
        console.error('Error seeding roles:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedRoles();
