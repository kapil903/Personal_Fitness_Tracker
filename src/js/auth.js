// Authentication functionality
let currentAuthMode = 'login';

function toggleAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (currentAuthMode === 'login') {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        currentAuthMode = 'register';
    } else {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        currentAuthMode = 'login';
    }
    
    clearMessages();
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

function showMessage(message, type = 'error') {
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const activeForm = document.querySelector('.auth-form.active');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
}

function enhanceInputFields() {
    // Get all input fields
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        // Add click event to focus input
        const inputGroup = input.closest('.input-group');
        
        inputGroup.addEventListener('click', function(e) {
            // Only focus if not already focused and click wasn't on the input itself
            if (e.target !== input && document.activeElement !== input) {
                input.focus();
                input.select(); // Select all text for easy replacement
            }
        });
        
        // Add touch event for mobile
        inputGroup.addEventListener('touchstart', function(e) {
            if (e.target !== input && document.activeElement !== input) {
                e.preventDefault();
                input.focus();
                input.select();
            }
        });
        
        // Ensure input gets focus on any interaction
        input.addEventListener('click', function() {
            this.select();
        });
        
        // Add visual feedback
        input.addEventListener('focus', function() {
            inputGroup.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            inputGroup.classList.remove('focused');
        });
        
        // Auto-select text when focused
        input.addEventListener('focus', function() {
            // Small delay to ensure the input is fully focused
            setTimeout(() => {
                this.select();
            }, 10);
        });
    });
}

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Authentication functions with backend integration and fallback
async function authenticateUser(email, password) {
    try {
        // Try backend first
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token for future API calls
            localStorage.setItem('authToken', data.token);
            return {
                success: true,
                user: data.user,
                token: data.token
            };
        } else {
            return {
                success: false,
                message: data.message || 'Login failed'
            };
        }
    } catch (error) {
        console.error('Backend login failed, trying fallback:', error);
        
        // Fallback to local authentication for demo
        if (email === 'demo@fittracker.com' && password === 'demo123') {
            const user = {
                id: 'demo-user',
                name: 'Demo User',
                email: email
            };
            localStorage.setItem('authToken', 'demo-token');
            return {
                success: true,
                user: user,
                token: 'demo-token'
            };
        }
        
        return {
            success: false,
            message: 'Invalid email or password. Try demo@fittracker.com / demo123'
        };
    }
}

async function registerUser(name, email, password) {
    try {
        // Try backend first
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token for future API calls
            localStorage.setItem('authToken', data.token);
            return {
                success: true,
                user: data.user,
                token: data.token
            };
        } else {
            return {
                success: false,
                message: data.message || 'Registration failed'
            };
        }
    } catch (error) {
        console.error('Backend registration failed, using fallback:', error);
        
        // Fallback to local registration
        const user = {
            id: Date.now().toString(),
            name: name,
            email: email
        };
        
        // Store user data locally
        localStorage.setItem('authToken', 'local-token');
        localStorage.setItem('localUser', JSON.stringify(user));
        
        return {
            success: true,
            user: user,
            token: 'local-token'
        };
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Enhance input field interactions
    enhanceInputFields();
    
    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = loginForm.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
        if (!email || !password) {
            showMessage('Please fill in all fields');
            resetButton(submitBtn, originalText);
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address');
            resetButton(submitBtn, originalText);
            return;
        }
        
        try {
            console.log('Attempting login with:', { email, password: '***' });
            const result = await authenticateUser(email, password);
            console.log('Login result:', result);
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('authToken', result.token);
                showMessage('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                console.error('Login failed:', result.message);
                showMessage(result.message || 'Login failed. Please try again.');
                resetButton(submitBtn, originalText);
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('An unexpected error occurred. Please try again.');
            resetButton(submitBtn, originalText);
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = registerForm.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields');
            resetButton(submitBtn, originalText);
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address');
            resetButton(submitBtn, originalText);
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match');
            resetButton(submitBtn, originalText);
            return;
        }
        
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long');
            resetButton(submitBtn, originalText);
            return;
        }
        
        try {
            console.log('Attempting registration with:', { name, email, password: '***' });
            const result = await registerUser(name, email, password);
            console.log('Registration result:', result);
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('authToken', result.token);
                showMessage('Registration successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                console.error('Registration failed:', result.message);
                showMessage(result.message || 'Registration failed. Please try again.');
                resetButton(submitBtn, originalText);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('An unexpected error occurred. Please try again.');
            resetButton(submitBtn, originalText);
        }
    });
    
    // Demo credentials hint
    setTimeout(() => {
        if (!localStorage.getItem('demoHintShown')) {
            showMessage('Demo: demo@fittracker.com / demo123', 'success');
            localStorage.setItem('demoHintShown', 'true');
        }
    }, 2000);
});
