const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    meal: {
        type: String,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: Number,
    carbs: Number,
    fats: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Nutrition', nutritionSchema);