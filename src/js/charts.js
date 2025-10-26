// Charts and data visualization
let weeklyChart, weightChart, activityChart, caloriesChart, workoutChart;

function initializeCharts() {
    createWeeklyChart();
    createWeightChart();
    createActivityChart();
    createCaloriesChart();
    createWorkoutChart();
}

function createWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    const data = generateWeeklyData();
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Steps',
                    data: data.steps,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Calories',
                    data: data.calories,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Steps'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Calories'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function createWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    const data = generateWeightData();
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: 'Weight (kg)',
                data: data.weights,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Weight (kg)'
                    }
                }
            }
        }
    });
}

function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const data = generateActivityData();
    
    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Walking', 'Running', 'Cycling', 'Strength', 'Yoga', 'Swimming'],
            datasets: [{
                label: 'Minutes',
                data: data.activities,
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

function createCaloriesChart() {
    const ctx = document.getElementById('caloriesChart');
    if (!ctx) return;
    
    const data = generateCaloriesData();
    
    caloriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Burned', 'Consumed'],
            datasets: [{
                data: [data.burned, data.consumed],
                backgroundColor: ['#ef4444', '#3b82f6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createWorkoutChart() {
    const ctx = document.getElementById('workoutChart');
    if (!ctx) return;
    
    const data = generateWorkoutData();
    
    workoutChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Workouts',
                    data: data.workouts,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Duration (min)',
                    data: data.duration,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Workouts'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Duration (min)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function updateProgressCharts() {
    const timeframe = document.getElementById('progressTimeframe').value;
    
    // Update all progress charts with new data based on timeframe
    if (weightChart) {
        const weightData = generateWeightData(timeframe);
        weightChart.data.labels = weightData.dates;
        weightChart.data.datasets[0].data = weightData.weights;
        weightChart.update();
    }
    
    if (activityChart) {
        const activityData = generateActivityData(timeframe);
        activityChart.data.datasets[0].data = activityData.activities;
        activityChart.update();
    }
    
    if (caloriesChart) {
        const caloriesData = generateCaloriesData(timeframe);
        caloriesChart.data.datasets[0].data = [caloriesData.burned, caloriesData.consumed];
        caloriesChart.update();
    }
    
    if (workoutChart) {
        const workoutData = generateWorkoutData(timeframe);
        workoutChart.data.labels = workoutData.dates;
        workoutChart.data.datasets[0].data = workoutData.workouts;
        workoutChart.data.datasets[1].data = workoutData.duration;
        workoutChart.update();
    }
}

// Data generation functions
function generateWeeklyData() {
    return {
        steps: [8500, 9200, 7800, 10500, 9800, 12000, 8900],
        calories: [320, 380, 290, 450, 420, 520, 350]
    };
}

function generateWeightData(timeframe = 30) {
    const dates = [];
    const weights = [];
    const baseWeight = 70;
    
    for (let i = timeframe - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate weight fluctuation
        const variation = (Math.random() - 0.5) * 0.5;
        weights.push(Math.round((baseWeight + variation) * 10) / 10);
    }
    
    return { dates, weights };
}

function generateActivityData(timeframe = 30) {
    return {
        activities: [120, 45, 60, 90, 30, 15] // Minutes per activity type
    };
}

function generateCaloriesData(timeframe = 30) {
    return {
        burned: 2800,
        consumed: 2200
    };
}

function generateWorkoutData(timeframe = 30) {
    const dates = [];
    const workouts = [];
    const duration = [];
    
    for (let i = timeframe - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Simulate workout data
        const workoutCount = Math.floor(Math.random() * 3);
        const workoutDuration = Math.floor(Math.random() * 60) + 20;
        
        workouts.push(workoutCount);
        duration.push(workoutCount > 0 ? workoutDuration : 0);
    }
    
    return { dates, workouts, duration };
}
