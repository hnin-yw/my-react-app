const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client URL
  credentials: true // Enable credentials (cookies)
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute');
const scheduleRoutes = require('./routes/scheduleRoute');

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedules', scheduleRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
