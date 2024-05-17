const attendeeService = require('../services/attendeeService');
const scheduleReminderService = require('../services/scheduleReminderService');
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

  static async getScheduleByIds(req, res) {
    try {
      const schedules = await scheduleService.getScheduleByIds(req);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllAttendeesBySchedule(req, res) {
    try {
      const scheduleId = req.params.id;
      const attendees = await scheduleService.getAllAttendeesBySchedule(scheduleId);
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async saveSchedule(req, res) {
    try {
      const scheduleData = req.body;
      await scheduleService.saveSchedule(scheduleData);
      res.status(200).json({ statusCode: 200, message: 'スケジュールは正常に登録されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getScheduleById(req, res) {
    try {
      const scheduleId = req.params.id;
      const schedule = await scheduleService.getScheduleById(scheduleId);
      const attendees = await attendeeService.getAttendeeByScheduleId(scheduleId);
      const scheduleReminders = await scheduleReminderService.getScheduleReminderByScheduleId(scheduleId);
      res.json({ 'schedule': schedule, 'attendees': attendees, 'scheduleReminders': scheduleReminders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateSchedule(req, res) {
    try {
      const scheduleData = req.body;
      await scheduleService.updateSchedule(scheduleData);
      res.status(200).json({ statusCode: 200, message: 'スケジュールは正常に更新されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteScheduleOne(req, res) {
    try {
      const userCode = req.cookies.userCode;
      const scheduleId = req.params.deleteValue;
      const isDel = await scheduleService.deleteScheduleOne(scheduleId, userCode);
      if (isDel) {
        res.status(200).json({ statusCode: 200, message: 'スケジュールは正常に削除されました。' });
      } else {
        res.status(201).json({ statusCode: 201, message: 'このスケジュールは削除できません。' });

      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteScheduleAll(req, res) {
    try {
      const userCode = req.cookies.userCode;
      const scheduleCode = req.params.deleteValue;
      const isDel = await scheduleService.deleteScheduleAll(scheduleCode, userCode);
      if (isDel) {
        res.status(200).json({ statusCode: 200, message: 'スケジュールは正常に削除されました。' });
      } else {
        res.status(201).json({ statusCode: 201, message: 'このスケジュールは削除できません。' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ScheduleController;
