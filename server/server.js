const express = require('express');
const cookieParser = require('cookie-parser'); // Correct import for cookie-parser middleware
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cookieParser()); // Use cookie-parser middleware before defining routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Use cors middleware to handle CORS issues

// Routes
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute');
const scheduleRoutes = require('./routes/scheduleRoute');

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedules', scheduleRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
