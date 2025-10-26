const express = require('express');
const router = express.Router();
const Progress = require('../models/progressModel');

// Get all progress entries
router.get('/', async (req, res) => {
    try {
        const entries = await Progress.find({ user: req.user._id });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new progress entry
router.post('/', async (req, res) => {
    try {
        const entry = new Progress({
            user: req.user._id,
            ...req.body
        });
        const savedEntry = await entry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update progress entry
router.put('/:id', async (req, res) => {
    try {
        const entry = await Progress.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Progress entry not found' });
        }
        
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedEntry = await Progress.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete progress entry
router.delete('/:id', async (req, res) => {
    try {
        const entry = await Progress.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Progress entry not found' });
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entry.remove();
        res.json({ message: 'Progress entry removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;