// Dashboard functionality
let currentUser = null;
let authToken = null;
let isStepTracking = false;
let stepCount = 0;
let activities = [];
let goals = [];
let nutritionData = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
};

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    initializeDashboard();
    setupEventListeners();
    loadWorkouts();
    loadGoals();
    updateNutritionDisplay();
});

function checkAuth() {
    // Set default user if not logged in
    if (!currentUser) {
        currentUser = {
            id: 'demo-user',
            name: 'Fitness User',
            email: 'user@fittracker.com'
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('authToken', 'demo-token');
    }
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('headerUserName').textContent = currentUser.name;
}

async function loadUserData() {
    try {
        // Load data from backend
        await Promise.all([
            loadActivities(),
            loadGoalsFromAPI(),
            loadNutritionFromAPI()
        ]);
    } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage
        const savedActivities = localStorage.getItem('activities');
        const savedGoals = localStorage.getItem('goals');
        const savedNutrition = localStorage.getItem('nutritionData');
        
        if (savedActivities) activities = JSON.parse(savedActivities);
        if (savedGoals) goals = JSON.parse(savedGoals);
        if (savedNutrition) nutritionData = JSON.parse(savedNutrition);
    }
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

async function loadActivities() {
    try {
        const data = await apiRequest('/activities');
        activities = data || [];
    } catch (error) {
        console.error('Failed to load activities:', error);
        activities = [];
    }
}

async function loadGoalsFromAPI() {
    try {
        const data = await apiRequest('/goals');
        goals = data || [];
    } catch (error) {
        console.error('Failed to load goals:', error);
        goals = [];
    }
}

async function loadNutritionFromAPI() {
    try {
        const data = await apiRequest('/nutrition');
        if (data && data.length > 0) {
            // Get today's nutrition data
            const today = new Date().toDateString();
            const todayNutrition = data.find(item => 
                new Date(item.date).toDateString() === today
            );
            
            if (todayNutrition) {
                nutritionData = {
                    calories: todayNutrition.calories || 0,
                    protein: todayNutrition.protein || 0,
                    carbs: todayNutrition.carbs || 0,
                    fat: todayNutrition.fat || 0,
                    water: todayNutrition.water || 0
                };
            }
        }
    } catch (error) {
        console.error('Failed to load nutrition:', error);
        // Keep default values
    }
}

function initializeDashboard() {
    updateDashboardStats();
    updateRecentActivities();
    initializeCharts();
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateToPage(page);
        });
    });

    // Activity form
    document.getElementById('activityForm').addEventListener('submit', handleActivitySubmit);
    
    // Meal tabs
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchMealTab(this.dataset.meal);
        });
    });

    // Workout category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchWorkoutCategory(this.dataset.category);
        });
    });
}

function navigateToPage(page) {
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Update page content
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        activities: 'Activities',
        workouts: 'Workouts',
        nutrition: 'Nutrition',
        goals: 'Goals',
        progress: 'Progress',
        chat: 'AI Assistant'
    };
    
    document.getElementById('pageTitle').textContent = titles[page];
    
    // Load page-specific data
    if (page === 'progress') {
        updateProgressCharts();
    }
}

function updateDashboardStats() {
    // Update steps
    const dailySteps = getTodaySteps();
    document.getElementById('dailySteps').textContent = dailySteps.toLocaleString();
    
    // Update calories burned
    const caloriesBurned = getTodayCaloriesBurned();
    document.getElementById('caloriesBurned').textContent = caloriesBurned;
    
    // Update workout time
    const workoutTime = getTodayWorkoutTime();
    document.getElementById('workoutTime').textContent = workoutTime;
    
    // Update progress bars
    updateProgressBar('stepsProgress', dailySteps, 10000);
    updateProgressBar('caloriesProgress', caloriesBurned, 500);
    updateProgressBar('workoutProgress', workoutTime, 60);
    
    // Update nutrition
    document.getElementById('caloriesConsumed').textContent = nutritionData.calories;
    document.getElementById('waterIntake').textContent = nutritionData.water;
}

function getTodaySteps() {
    const today = new Date().toDateString();
    return activities
        .filter(activity => new Date(activity.date).toDateString() === today && activity.type === 'walking')
        .reduce((total, activity) => total + (activity.steps || 0), stepCount);
}

function getTodayCaloriesBurned() {
    const today = new Date().toDateString();
    return activities
        .filter(activity => new Date(activity.date).toDateString() === today)
        .reduce((total, activity) => total + (activity.calories || 0), 0);
}

function getTodayWorkoutTime() {
    const today = new Date().toDateString();
    return activities
        .filter(activity => new Date(activity.date).toDateString() === today && activity.type !== 'walking')
        .reduce((total, activity) => total + (activity.duration || 0), 0);
}

function updateProgressBar(elementId, current, target) {
    const percentage = Math.min((current / target) * 100, 100);
    document.getElementById(elementId).style.width = `${percentage}%`;
}

function updateRecentActivities() {
    const container = document.getElementById('recentActivities');
    const recentActivities = activities.slice(-3).reverse();
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <h4>${formatActivityName(activity.type)}</h4>
                <p>${activity.duration} minutes • ${activity.calories || 0} calories</p>
                <span class="activity-time">${formatActivityTime(activity.date)}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        walking: 'walking',
        running: 'running',
        cycling: 'biking',
        swimming: 'swimming',
        weightlifting: 'dumbbell',
        yoga: 'spa',
        other: 'heart'
    };
    return icons[type] || 'heart';
}

function formatActivityName(type) {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
}

function formatActivityTime(date) {
    const now = new Date();
    const activityDate = new Date(date);
    const diffHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Activity Tracking Functions
function startStepTracking() {
    isStepTracking = true;
    stepCount = 0;
    document.querySelector('.steps-controls button:first-child').textContent = 'Tracking...';
    document.querySelector('.steps-controls button:first-child').disabled = true;
    
    // Simulate step counting
    const stepInterval = setInterval(() => {
        if (isStepTracking) {
            stepCount += Math.floor(Math.random() * 3) + 1;
            document.getElementById('currentSteps').textContent = stepCount;
            updateDashboardStats();
        } else {
            clearInterval(stepInterval);
        }
    }, 1000);
}

function stopStepTracking() {
    isStepTracking = false;
    document.querySelector('.steps-controls button:first-child').textContent = 'Start Tracking';
    document.querySelector('.steps-controls button:first-child').disabled = false;
    
    // Save step activity
    if (stepCount > 0) {
        const activity = {
            id: Date.now(),
            type: 'walking',
            duration: Math.floor(stepCount / 100), // Approximate duration
            steps: stepCount,
            calories: Math.floor(stepCount * 0.04), // Approximate calories
            date: new Date().toISOString(),
            intensity: 'moderate'
        };
        
        activities.push(activity);
        saveActivities();
        updateDashboardStats();
        updateRecentActivities();
        stepCount = 0;
        document.getElementById('currentSteps').textContent = '0';
    }
}

async function handleActivitySubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Logging Activity...';
    submitBtn.disabled = true;
    
    try {
        const activity = {
            type: document.getElementById('activityType').value,
            duration: parseInt(document.getElementById('activityDuration').value),
            distance: parseFloat(document.getElementById('activityDistance').value) || 0,
            calories: parseInt(document.getElementById('activityCalories').value) || 0,
            intensity: document.getElementById('activityIntensity').value,
            date: new Date().toISOString()
        };
        
        // Save to backend
        const savedActivity = await apiRequest('/activities', {
            method: 'POST',
            body: JSON.stringify(activity)
        });
        
        activities.push(savedActivity);
        updateDashboardStats();
        updateRecentActivities();
        updateActivitiesList();
        
        e.target.reset();
        showNotification('Activity logged successfully!', 'success');
    } catch (error) {
        console.error('Failed to save activity:', error);
        showNotification('Failed to save activity. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function updateActivitiesList() {
    const container = document.getElementById('activitiesList');
    const today = new Date().toDateString();
    
    const todayActivities = activities
        .filter(activity => new Date(activity.date).toDateString() === today)
        .reverse();
    
    container.innerHTML = todayActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <h4>${formatActivityName(activity.type)}</h4>
                <p>${activity.duration} minutes • ${activity.calories} calories</p>
                <span class="activity-time">${formatActivityTime(activity.date)}</span>
            </div>
        </div>
    `).join('');
}

// Workout Functions
function loadWorkouts() {
    const workouts = [
        {
            id: 1,
            name: 'Morning Cardio Blast',
            description: 'High-intensity cardio workout to start your day',
            duration: 30,
            difficulty: 'beginner',
            category: 'cardio',
            exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees']
        },
        {
            id: 2,
            name: 'Upper Body Strength',
            description: 'Build upper body strength with these exercises',
            duration: 45,
            difficulty: 'intermediate',
            category: 'strength',
            exercises: ['Push-ups', 'Pull-ups', 'Dumbbell Press', 'Rows']
        },
        {
            id: 3,
            name: 'Yoga Flow',
            description: 'Relaxing yoga sequence for flexibility',
            duration: 60,
            difficulty: 'beginner',
            category: 'flexibility',
            exercises: ['Downward Dog', 'Warrior Poses', 'Tree Pose', 'Savasana']
        },
        {
            id: 4,
            name: 'HIIT Training',
            description: 'High-intensity interval training',
            duration: 25,
            difficulty: 'advanced',
            category: 'cardio',
            exercises: ['Burpees', 'Squat Jumps', 'Push-ups', 'Plank']
        }
    ];
    
    displayWorkouts(workouts);
}

function displayWorkouts(workouts) {
    const container = document.getElementById('workoutsGrid');
    
    container.innerHTML = workouts.map(workout => `
        <div class="workout-card">
            <h4>${workout.name}</h4>
            <p>${workout.description}</p>
            <div class="workout-meta">
                <div class="workout-duration">
                    <i class="fas fa-clock"></i>
                    ${workout.duration} min
                </div>
                <span class="workout-difficulty ${workout.difficulty}">
                    ${workout.difficulty}
                </span>
            </div>
            <button class="btn-primary" onclick="startWorkout(${workout.id})">
                <i class="fas fa-play"></i>
                Start Workout
            </button>
        </div>
    `).join('');
}

function switchWorkoutCategory(category) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter and display workouts based on category
    const allWorkouts = [
        {
            id: 1, name: 'Morning Cardio Blast', description: 'High-intensity cardio workout',
            duration: 30, difficulty: 'beginner', category: 'cardio'
        },
        {
            id: 2, name: 'Upper Body Strength', description: 'Build upper body strength',
            duration: 45, difficulty: 'intermediate', category: 'strength'
        },
        {
            id: 3, name: 'Yoga Flow', description: 'Relaxing yoga sequence',
            duration: 60, difficulty: 'beginner', category: 'flexibility'
        },
        {
            id: 4, name: 'HIIT Training', description: 'High-intensity interval training',
            duration: 25, difficulty: 'advanced', category: 'cardio'
        }
    ];
    
    const filteredWorkouts = category === 'recommended' ? allWorkouts : 
                           allWorkouts.filter(workout => workout.category === category);
    
    displayWorkouts(filteredWorkouts);
}

function startWorkout(workoutId) {
    showNotification('Workout started! Track your progress.', 'success');
    // Add workout tracking logic here
}

// Nutrition Functions
function switchMealTab(meal) {
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-meal="${meal}"]`).classList.add('active');
    
    document.querySelectorAll('.meal-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${meal}-section`).classList.add('active');
}

function addFoodToMeal(meal) {
    document.getElementById('foodMeal').value = meal;
    openModal('addFoodModal');
}

async function saveFoodItem() {
    const saveBtn = document.querySelector('#addFoodModal .btn-primary');
    const originalText = saveBtn.textContent;
    
    // Show loading state
    saveBtn.textContent = 'Adding Food...';
    saveBtn.disabled = true;
    
    try {
        const food = {
            name: document.getElementById('foodName').value,
            calories: parseInt(document.getElementById('foodCalories').value),
            protein: parseFloat(document.getElementById('foodProtein').value) || 0,
            carbs: parseFloat(document.getElementById('foodCarbs').value) || 0,
            fat: parseFloat(document.getElementById('foodFat').value) || 0,
            quantity: parseFloat(document.getElementById('foodQuantity').value),
            unit: document.getElementById('foodUnit').value,
            meal: document.getElementById('foodMeal').value
        };
        
        // Update nutrition data
        nutritionData.calories += food.calories;
        nutritionData.protein += food.protein;
        nutritionData.carbs += food.carbs;
        nutritionData.fat += food.fat;
        
        // Save to backend
        await apiRequest('/nutrition', {
            method: 'POST',
            body: JSON.stringify(nutritionData)
        });
        
        updateNutritionDisplay();
        closeModal('addFoodModal');
        showNotification('Food item added successfully!', 'success');
        
        // Reset form
        document.getElementById('foodForm').reset();
    } catch (error) {
        console.error('Failed to save nutrition:', error);
        showNotification('Failed to save food item. Please try again.', 'error');
    } finally {
        // Reset button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

function updateNutritionDisplay() {
    document.getElementById('caloriesCurrent').textContent = nutritionData.calories;
    document.getElementById('proteinCurrent').textContent = Math.round(nutritionData.protein);
    document.getElementById('carbsCurrent').textContent = Math.round(nutritionData.carbs);
    document.getElementById('waterCurrent').textContent = nutritionData.water;
    
    // Update progress bars
    updateProgressBar('caloriesProgressBar', nutritionData.calories, 2000);
    updateProgressBar('proteinProgressBar', nutritionData.protein, 150);
    updateProgressBar('carbsProgressBar', nutritionData.carbs, 250);
    updateProgressBar('waterProgressBar', nutritionData.water, 8);
}

// Goal Functions
function loadGoals() {
    const defaultGoals = [
        {
            id: 1,
            title: 'Daily Steps',
            description: 'Walk 10,000 steps every day',
            type: 'steps',
            target: 10000,
            current: 7500,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            category: 'fitness'
        },
        {
            id: 2,
            title: 'Weight Loss',
            description: 'Lose 5kg in 3 months',
            type: 'weight',
            target: 5,
            current: 2.5,
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            category: 'health'
        }
    ];
    
    if (goals.length === 0) {
        goals = defaultGoals;
        saveGoals();
    }
    
    displayGoals();
}

function displayGoals() {
    const container = document.getElementById('goalsGrid');
    
    container.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <h4 class="goal-title">${goal.title}</h4>
                <span class="goal-type">${goal.category}</span>
            </div>
            <p class="goal-description">${goal.description}</p>
            <div class="goal-progress-section">
                <div class="goal-progress-text">
                    <span class="current">${goal.current}</span>
                    <span class="target">${goal.target}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(goal.current / goal.target) * 100}%"></div>
                </div>
            </div>
            <div class="goal-deadline">
                <i class="fas fa-calendar"></i>
                <span>Due: ${goal.deadline.toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function saveNutritionData() {
    localStorage.setItem('nutritionData', JSON.stringify(nutritionData));
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('activities');
    localStorage.removeItem('goals');
    localStorage.removeItem('nutritionData');
    // Just refresh the page to reset everything
    window.location.reload();
}

// Quick action functions
function startWorkout() {
    navigateToPage('workouts');
}

function logMeal() {
    navigateToPage('nutrition');
    openModal('addFoodModal');
}

function setGoal() {
    navigateToPage('goals');
}

function viewProgress() {
    navigateToPage('progress');
}

function addActivity() {
    navigateToPage('activities');
}

function createWorkout() {
    navigateToPage('workouts');
}

function addFood() {
    openModal('addFoodModal');
}

function createGoal() {
    // Add goal creation functionality
    showNotification('Goal creation feature coming soon!', 'info');
}

// Initialize charts
function initializeCharts() {
    // This will be handled by charts.js
}
