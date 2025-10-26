require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Your React app's URL
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Protected Routes
const { protect } = require('./middleware/authMiddleware');
app.use('/api/activities', protect, require('./routes/activityRoutes'));
app.use('/api/nutrition', protect, require('./routes/nutritionRoutes'));
app.use('/api/goals', protect, require('./routes/goalRoutes'));
app.use('/api/progress', protect, require('./routes/progressRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});