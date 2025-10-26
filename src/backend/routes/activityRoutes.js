const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');

// Get all activities for a user
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new activity
router.post('/', async (req, res) => {
    try {
        const activity = new Activity({
            user: req.user._id,
            ...req.body
        });
        const savedActivity = await activity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an activity
router.put('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        
        if (activity.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an activity
router.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        if (activity.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await activity.remove();
        res.json({ message: 'Activity removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;