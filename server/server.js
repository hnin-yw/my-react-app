// server.js
const express = require('express');
const cors = require('cors'); // Import the cors package
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//to resolve not allowed by Access-Control-Allow-Origin
app.use(cors()); // Use the cors middleware

// Routes
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute');
const scheduleRoutes = require('./routes/scheduleRoute');

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedules', scheduleRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
