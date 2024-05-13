const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/:values', scheduleController.getAllSchedules);


module.exports = router;
