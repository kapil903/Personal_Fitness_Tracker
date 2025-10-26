# FitTracker - Personal Fitness Tracker

A comprehensive personal fitness tracking application with AI-powered health assistant, built with modern web technologies.

## Features

- 🔐 **User Authentication** - Secure login/register system
- 📊 **Activity Tracking** - Track workouts, steps, and daily activities
- 🎯 **Goal Setting** - Set and monitor fitness goals
- 📈 **Progress Analytics** - Beautiful charts and data visualization
- 🍎 **Nutrition Tracking** - Log meals and monitor nutritional intake
- 🤖 **AI Health Assistant** - Get personalized diet and exercise recommendations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **Real-time Updates** - Live data synchronization

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-fitness-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000`

## Demo Credentials

- **Email**: demo@fittracker.com
- **Password**: demo123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Activities
- `POST /api/activities` - Log new activity
- `GET /api/activities` - Get user activities

### Goals
- `POST /api/goals` - Create new goal
- `GET /api/goals` - Get user goals
- `PUT /api/goals/:id` - Update goal

### Nutrition
- `POST /api/nutrition` - Log nutrition data
- `GET /api/nutrition` - Get nutrition history

### AI Chat
- `POST /api/chat` - Get AI health recommendations

## Features Overview

### Dashboard
- Daily stats (steps, calories, workout time)
- Progress charts and trends
- Quick actions for common tasks
- Recent activity feed

### Activity Tracking
- Manual activity logging
- Step counter simulation
- Workout duration tracking
- Calorie burn estimation

### Nutrition Tracking
- Meal logging (breakfast, lunch, dinner, snacks)
- Macronutrient tracking (protein, carbs, fat)
- Water intake monitoring
- Daily nutrition goals

### Goal Management
- Set custom fitness goals
- Progress tracking with visual indicators
- Deadline management
- Goal categories (fitness, health, weight)

### AI Health Assistant
- Personalized diet recommendations
- Exercise suggestions
- Health tips and guidance
- Quick question templates

### Progress Analytics
- Weight tracking charts
- Activity trend analysis
- Calorie balance visualization
- Workout frequency tracking

## File Structure

```
personal-fitness-tracker/
├── index.html              # Authentication page
├── dashboard.html          # Main application
├── server.js              # Backend server
├── package.json           # Dependencies
├── styles/
│   ├── auth.css           # Authentication styles
│   └── dashboard.css      # Dashboard styles
├── js/
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Main app functionality
│   ├── charts.js          # Data visualization
│   └── ai-chat.js         # AI chatbot
└── README.md              # This file
```

## Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

### Customization
- Modify workout categories in `js/dashboard.js`
- Add new AI responses in `js/ai-chat.js`
- Customize charts in `js/charts.js`
- Update styling in CSS files

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization

## Development

### Adding New Features
1. Create frontend components in HTML/CSS
2. Add JavaScript functionality
3. Create backend API endpoints
4. Update database schemas if needed
5. Test thoroughly

### Database Schema
- **Users**: Authentication and profile data
- **Activities**: Workout and exercise logs
- **Goals**: User-defined fitness goals
- **Nutrition**: Daily nutrition tracking

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t fittracker .
docker run -p 3000:3000 fittracker
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (friends, challenges)
- [ ] Advanced AI integration
- [ ] Wearable device integration
- [ ] Meal planning and recipes
- [ ] Professional trainer features
- [ ] Data export functionality

---

**Built with ❤️ for fitness enthusiasts**
