const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fittracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    weight: { type: Number, default: 70 },
    height: { type: Number, default: 170 },
    age: { type: Number, default: 25 },
    activityLevel: { type: String, default: 'moderate' },
    goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Activity Schema
const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    intensity: { type: String, default: 'moderate' },
    date: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

// Goal Schema
const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    category: { type: String, default: 'fitness' }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

// Nutrition Schema
const nutritionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    meals: [{
        type: { type: String }, // breakfast, lunch, dinner, snacks
        items: [{
            name: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
            quantity: Number,
            unit: String
        }]
    }]
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Activity Routes
app.post('/api/activities', authenticateToken, async (req, res) => {
    try {
        const activity = new Activity({
            ...req.body,
            userId: req.user.userId
        });
        
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .limit(50);
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Goal Routes
app.post('/api/goals', authenticateToken, async (req, res) => {
    try {
        const goal = new Goal({
            ...req.body,
            userId: req.user.userId
        });
        
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/goals', authenticateToken, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.userId });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true }
        );
        
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Nutrition Routes
app.post('/api/nutrition', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let nutrition = await Nutrition.findOne({
            userId: req.user.userId,
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });
        
        if (!nutrition) {
            nutrition = new Nutrition({
                userId: req.user.userId,
                date: today
            });
        }
        
        // Update nutrition data
        Object.assign(nutrition, req.body);
        await nutrition.save();
        
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/nutrition', authenticateToken, async (req, res) => {
    try {
        const nutrition = await Nutrition.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .limit(30);
        
        res.json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// AI Chat Route
app.post('/api/chat', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        // Simple AI response logic (replace with actual AI service)
        const response = generateAIResponse(message);
        
        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
        return "Focus on whole foods: lean proteins, vegetables, fruits, and whole grains. Limit processed foods and stay hydrated.";
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
        return "Aim for 150 minutes of moderate exercise per week. Include both cardio and strength training for best results.";
    } else if (lowerMessage.includes('weight')) {
        return "Sustainable weight loss requires a calorie deficit through diet and exercise. Aim for 1-2 pounds per week.";
    } else {
        return "I'm here to help with your fitness journey! Feel free to ask about diet, exercise, or health tips.";
    }
}

// Serve static files
app.use(express.static('.'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the app`);
});
