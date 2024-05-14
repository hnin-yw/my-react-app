const scheduleService = require('../services/scheduleService');

class ScheduleController {
  static async getAllSchedules(req, res) {
    try {
      const schedules = await scheduleService.getAllSchedules(req);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllAttendeesBySchedule(req, res) {
    try {
      const scheduleId = req.params.id;
      const group = await scheduleService.getAllAttendeesBySchedule(scheduleId);
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ScheduleController;
