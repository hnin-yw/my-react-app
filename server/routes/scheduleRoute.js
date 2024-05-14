const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.get('/attendee_list/:id', scheduleController.getAllAttendeesBySchedule);


module.exports = router;
