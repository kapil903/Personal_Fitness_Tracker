const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    weight: Number,
    bodyFat: Number,
    measurements: {
        chest: Number,
        waist: Number,
        hips: Number,
        arms: Number,
        thighs: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);