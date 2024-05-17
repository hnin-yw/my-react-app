const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/', scheduleController.getAllSchedules);
router.get('/attendee_list/:id', scheduleController.getAllAttendeesBySchedule);
router.get('/download', scheduleController.getScheduleByIds);
router.post('/', scheduleController.saveSchedule);
router.get('/edit/:id', scheduleController.getScheduleById);
router.put('/deleteOne/:deleteValue', scheduleController.deleteScheduleOne);
router.put('/deleteAll/:deleteValue', scheduleController.deleteScheduleAll);
router.put('/update', scheduleController.updateSchedule);


module.exports = router;
