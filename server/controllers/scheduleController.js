const scheduleService = require('../services/scheduleService');

class ScheduleController {
  static async getAllSchedules(req, res) {
    try {
      console.log("ScheduleController",req);
      const schedules = await scheduleService.getAllSchedules(req);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ScheduleController;
