# FitTracker Setup Guide

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
Or double-click `start.bat` on Windows

### 3. Open the App
Visit: http://localhost:3000

## Demo Login
- **Email**: demo@fittracker.com
- **Password**: demo123

## Features Now Working

✅ **Authentication System**
- Secure login/register with JWT tokens
- Form validation and error handling
- Loading states and smooth transitions

✅ **Backend Integration**
- All data saved to MongoDB
- Real-time API calls
- Automatic fallback to localStorage if server is down

✅ **Activity Tracking**
- Log activities with backend persistence
- Step counter simulation
- Activity history and statistics

✅ **Nutrition Tracking**
- Food logging with backend storage
- Macronutrient tracking
- Daily nutrition goals

✅ **AI Chatbot**
- Backend-connected AI responses
- Fallback to local responses if server is down
- Health and fitness recommendations

✅ **Data Visualization**
- Real-time charts and graphs
- Progress tracking
- Beautiful dashboard interface

## Database Setup (Optional)

### Option 1: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The app will automatically connect to `mongodb://localhost:27017/fittracker`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update server.js with your connection string

### Option 3: No Database (Fallback Mode)
- App works with localStorage only
- Data persists in browser
- No backend features but core functionality works

## Troubleshooting

### Server Won't Start
- Make sure port 3000 is available
- Check if MongoDB is running (if using database)
- Try: `npm install` again

### Login Issues
- Make sure server is running on port 3000
- Check browser console for errors
- Try the demo credentials first

### Data Not Saving
- Check if server is running
- Verify MongoDB connection
- Check browser console for API errors

## Development

### Making Changes
1. Edit files in the project
2. Restart server: `npm start`
3. Refresh browser

### File Structure
```
├── index.html          # Login page
├── dashboard.html      # Main app
├── server.js          # Backend API
├── styles/            # CSS files
├── js/                # JavaScript files
└── package.json       # Dependencies
```

## Production Deployment

### Heroku
1. Create Heroku app
2. Add MongoDB Atlas addon
3. Deploy with Git

### Vercel/Netlify
- Frontend: Deploy HTML/CSS/JS files
- Backend: Deploy server.js separately
- Update API_BASE_URL in JavaScript files

## Support

If you encounter issues:
1. Check the console for errors
2. Make sure all dependencies are installed
3. Verify MongoDB is running (if using database)
4. Try the demo login first

The app is designed to work even without a database - it will fallback to localStorage for data persistence.
