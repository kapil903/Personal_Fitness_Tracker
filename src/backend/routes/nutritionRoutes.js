const express = require('express');
const router = express.Router();
const Nutrition = require('../models/nutritionModel');

// Get all nutrition entries
router.get('/', async (req, res) => {
    try {
        const entries = await Nutrition.find({ user: req.user._id });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new nutrition entry
router.post('/', async (req, res) => {
    try {
        const entry = new Nutrition({
            user: req.user._id,
            ...req.body
        });
        const savedEntry = await entry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update nutrition entry
router.put('/:id', async (req, res) => {
    try {
        const entry = await Nutrition.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Nutrition entry not found' });
        }
        
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedEntry = await Nutrition.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete nutrition entry
router.delete('/:id', async (req, res) => {
    try {
        const entry = await Nutrition.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Nutrition entry not found' });
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entry.remove();
        res.json({ message: 'Nutrition entry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;