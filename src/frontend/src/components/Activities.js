import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        type: '',
        duration: '',
        calories: '',
        notes: ''
    });

    // Fetch activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${API_URL}/activities`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };

        fetchActivities();
    }, []);

    // Add new activity
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/activities`,
                newActivity,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setActivities([...activities, response.data]);
            setNewActivity({ type: '', duration: '', calories: '', notes: '' });
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    // Delete activity
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/activities/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setActivities(activities.filter(activity => activity._id !== id));
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    return (
        <div>
            <h2>Activities</h2>
            
            {/* Add Activity Form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Activity Type"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({
                        ...newActivity,
                        type: e.target.value
                    })}
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({
                        ...newActivity,
                        duration: e.target.value
                    })}
                />
                <input
                    type="number"
                    placeholder="Calories"
                    value={newActivity.calories}
                    onChange={(e) => setNewActivity({
                        ...newActivity,
                        calories: e.target.value
                    })}
                />
                <textarea
                    placeholder="Notes"
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({
                        ...newActivity,
                        notes: e.target.value
                    })}
                />
                <button type="submit">Add Activity</button>
            </form>

            {/* Activities List */}
            <div className="activities-list">
                {activities.map(activity => (
                    <div key={activity._id} className="activity-card">
                        <h3>{activity.type}</h3>
                        <p>Duration: {activity.duration} minutes</p>
                        <p>Calories: {activity.calories}</p>
                        <p>Notes: {activity.notes}</p>
                        <button onClick={() => handleDelete(activity._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;