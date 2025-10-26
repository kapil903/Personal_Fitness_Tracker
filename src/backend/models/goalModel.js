const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: true,
        enum: ['weight', 'workout', 'nutrition']
    },
    target: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'failed'],
        default: 'in-progress'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);