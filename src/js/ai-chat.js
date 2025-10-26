// AI Chatbot functionality
const aiResponses = {
    diet: [
        "Here's a healthy diet plan for you: Focus on lean proteins (chicken, fish, beans), whole grains (brown rice, quinoa), plenty of vegetables, and healthy fats (avocado, nuts). Aim for 5-6 small meals throughout the day.",
        "For weight loss, try the Mediterranean diet: olive oil, fish, vegetables, fruits, and whole grains. Limit processed foods and added sugars.",
        "A balanced diet includes: 50% vegetables/fruits, 25% lean protein, 25% whole grains. Stay hydrated with 8+ glasses of water daily."
    ],
    exercise: [
        "For beginners: Start with 20-30 minutes of cardio 3x/week (walking, cycling). Add strength training 2x/week with bodyweight exercises.",
        "High-intensity workouts: Try HIIT training - 30 seconds intense exercise, 30 seconds rest, repeat for 15-20 minutes.",
        "Strength training: Focus on compound movements like squats, push-ups, and deadlifts. Aim for 3 sets of 8-12 repetitions."
    ],
    weight: [
        "Weight loss tips: Create a calorie deficit (burn more than you consume), focus on whole foods, drink plenty of water, and maintain consistent exercise routine.",
        "Track your progress: Weigh yourself weekly, take body measurements, and focus on how you feel rather than just the scale.",
        "Sustainable weight loss: Aim for 1-2 pounds per week through diet and exercise. Avoid extreme restrictions."
    ],
    general: [
        "Great question! Remember to listen to your body and make gradual changes. Consistency is key to achieving your fitness goals.",
        "For optimal health, combine regular exercise with a balanced diet, adequate sleep (7-9 hours), and stress management.",
        "Don't forget to warm up before exercise and cool down afterward. Proper form is more important than intensity."
    ]
};

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const sendBtn = document.querySelector('.send-btn');
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    // Show loading state
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    sendBtn.disabled = true;
    
    try {
        // Get AI response from backend
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            addMessage(data.response, 'bot');
        } else {
            // Fallback to local AI response
            const fallbackResponse = generateAIResponse(message);
            addMessage(fallbackResponse, 'bot');
        }
    } catch (error) {
        console.error('AI chat error:', error);
        // Fallback to local AI response
        const fallbackResponse = generateAIResponse(message);
        addMessage(fallbackResponse, 'bot');
    } finally {
        // Reset button
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendBtn.disabled = false;
    }
}

function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${content}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('nutrition')) {
        return aiResponses.diet[Math.floor(Math.random() * aiResponses.diet.length)];
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('training')) {
        return aiResponses.exercise[Math.floor(Math.random() * aiResponses.exercise.length)];
    } else if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('fat')) {
        return aiResponses.weight[Math.floor(Math.random() * aiResponses.weight.length)];
    } else {
        return aiResponses.general[Math.floor(Math.random() * aiResponses.general.length)];
    }
}

function askQuickQuestion(type) {
    const questions = {
        diet: "What's a healthy meal plan for weight loss?",
        exercise: "What exercises should I do for building muscle?",
        weight: "How can I lose weight safely and effectively?"
    };
    
    const question = questions[type];
    document.getElementById('chatInput').value = question;
    sendMessage();
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
