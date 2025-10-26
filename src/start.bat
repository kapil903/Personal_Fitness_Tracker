@echo off
echo Starting FitTracker Server...
echo.
echo Make sure MongoDB is running on your system
echo If you don't have MongoDB, you can:
echo 1. Install MongoDB locally
echo 2. Use MongoDB Atlas (cloud)
echo 3. Or the app will work with localStorage fallback
echo.
echo Server will start on http://localhost:3000
echo.
npm start
pause
