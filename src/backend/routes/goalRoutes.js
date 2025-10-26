const express = require('express');
const router = express.Router();
const Goal = require('../models/goalModel');

// Get all goals
router.get('/', async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new goal
router.post('/', async (req, res) => {
    try {
        const goal = new Goal({
            user: req.user._id,
            ...req.body
        });
        const savedGoal = await goal.save();
        res.status(201).json(savedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update goal
router.put('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete goal
router.delete('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await goal.remove();
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;