const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// Load environment variables as early as possible
dotenv.config();
// Connect DB first
connectDB(); 



// Middleware
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running sucessfully'})
});

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;
