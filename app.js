const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
// Load environment variables as early as possible
dotenv.config();
// Connect DB first
connectDB(); 

// Security
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }); // 300 req / 15 min per IP
app.use(limiter);




// Middleware

app.use(express.json({limit: "10kb"}));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running sucessfully'})
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


module.exports = app;
