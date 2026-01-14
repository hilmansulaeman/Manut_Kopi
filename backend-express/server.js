require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // For authentication middleware
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const port = process.env.PORT || 5001; // Changed from 5000 to 5001 to avoid conflict

// Import routes
const authRoutes = require('./routes/authRoutes');
const outletRoutes = require('./routes/outletRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const registerRoutes = require('./routes/registerRoutes');
const taxRoutes = require('./routes/taxRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productPriceRoutes = require('./routes/productPriceRoutes');
const productStockRoutes = require('./routes/productStockRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const returnRoutes = require('./routes/returnRoutes');
const stockAdjustmentRoutes = require('./routes/stockAdjustmentRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authorize = require('./middleware/rbac'); // Import RBAC middleware

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Authentication Middleware (simple example)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // No token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
};

// MongoDB Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import audit log routes AFTER authenticateToken is defined
const auditLogRoutes = require('./routes/auditLogRoutes')(authenticateToken);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        url: 'http://localhost:5001/api' // Explicitly set the API base URL for Swagger UI
    }
}));

// Use Auth Routes
app.use('/api/auth', authRoutes);

// Apply authentication middleware to all routes after this point (except auth)
// app.use(authenticateToken); // Uncomment this line to protect all subsequent routes

// Basic Route (unprotected)
app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

// Master Data Routes (protected with RBAC)
// For Master Data, Admin and Manager roles are allowed for CRUD operations.
app.use('/api/outlets', authenticateToken, authorize(['Admin', 'Manager']), outletRoutes);
app.use('/api/categories', authenticateToken, authorize(['Admin', 'Manager']), categoryRoutes);
app.use('/api/registers', authenticateToken, authorize(['Admin', 'Manager']), registerRoutes);
app.use('/api/taxes', authenticateToken, authorize(['Admin', 'Manager']), taxRoutes);
app.use('/api/products', authenticateToken, authorize(['Admin', 'Manager']), productRoutes);
app.use('/api/suppliers', authenticateToken, authorize(['Admin', 'Manager']), supplierRoutes);
app.use('/api/product-prices', authenticateToken, authorize(['Admin', 'Manager']), productPriceRoutes);
app.use('/api/product-stocks', authenticateToken, authorize(['Admin', 'Manager']), productStockRoutes);
app.use('/api/customers', authenticateToken, authorize(['Admin', 'Manager']), customerRoutes);
app.use('/api/payment-methods', authenticateToken, authorize(['Admin', 'Manager']), paymentMethodRoutes);

// Shift Routes (protected with RBAC)
// Cashier, Admin, Manager can open/close/view shifts
app.use('/api/shifts', authenticateToken, authorize(['Cashier', 'Admin', 'Manager']), shiftRoutes);

// Purchase Routes (protected with RBAC)
// Warehouse, Admin, Manager can manage purchases
app.use('/api/purchases', authenticateToken, authorize(['Warehouse', 'Admin', 'Manager']), purchaseRoutes);

// Sales Routes (protected with RBAC)
// Cashier, Admin, Manager can manage sales
app.use('/api/sales', authenticateToken, authorize(['Cashier', 'Admin', 'Manager']), saleRoutes);

// Payment Routes (protected with RBAC)
// Cashier, Admin, Manager can manage payments
app.use('/api/payments', authenticateToken, authorize(['Cashier', 'Admin', 'Manager']), paymentRoutes);

// Return Routes (protected with RBAC)
// Cashier, Admin, Manager can manage returns
app.use('/api/returns', authenticateToken, authorize(['Cashier', 'Admin', 'Manager']), returnRoutes);

// Stock Adjustment Routes (protected with RBAC)
// Warehouse, Admin, Manager can manage stock adjustments
app.use('/api/stock-adjustments', authenticateToken, authorize(['Warehouse', 'Admin', 'Manager']), stockAdjustmentRoutes);

// Stock Movement Routes (protected with RBAC)
// Warehouse, Admin, Manager can view stock movements
app.use('/api/stock-movements', authenticateToken, authorize(['Warehouse', 'Admin', 'Manager']), stockMovementRoutes);

// Promotion Routes (protected with RBAC)
// Admin, Manager can manage promotions
app.use('/api/promotions', authenticateToken, authorize(['Admin', 'Manager']), promotionRoutes);

// Expense Routes (protected with RBAC)
// Cashier, Admin, Manager can manage expenses
app.use('/api/expenses', authenticateToken, authorize(['Cashier', 'Admin', 'Manager']), expenseRoutes);

// Audit Log Routes (protected with RBAC - Admin only)
app.use('/api/audit-logs', auditLogRoutes); // authenticateToken is now handled within the auditLogRoutes module

// Example Protected API Route
app.get('/api/items', authenticateToken, (req, res) => {
    res.json([{ id: 1, name: 'Protected Item 1' }, { id: 2, name: 'Protected Item 2' }]);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
