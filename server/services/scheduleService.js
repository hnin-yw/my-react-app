const Schedule = require('../models/Schedule');
const attendeeService = require('../services/attendeeService');
const scheduleReminderService = require('../services/scheduleReminderService');

class ScheduleService {
  static async getAllSchedules(req) {
    return new Promise((resolve, reject) => {
      const selData = {
        user_code: req.cookies.userCode,
        group_code: req.cookies.groupCode
      };
      Schedule.getAll(selData, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }

  static async getScheduleByIds(req) {
    return new Promise((resolve, reject) => {
      req = req.query.ids;
      Schedule.getScheduleByIds(req, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }

  static async getAllAttendeesBySchedule(id) {
    return new Promise((resolve, reject) => {
      Schedule.getAllAttendeesBySchedule(id, (err, attendees) => {
        if (err) {
          reject(err);
        } else {
          resolve(attendees);
        }
      });
    });
  }

  static async deleteScheduleOne(scheduleId, userCode) {
    try {
      const delData = {
        id: scheduleId,
        del_flg: true,
        updated_by: userCode,
        updated_at: new Date()
      };
      await attendeeService.deleteAttendees(delData);
      await scheduleReminderService.deleteScheduleReminders(delData);
      await Schedule.deleteSchedule(delData);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteScheduleAll(scheduleCode, userCode) {
    try {
      const dbSchedules = await this.getScheduleByCode(scheduleCode);
      for (const schedule of dbSchedules) {
        const delData = {
          id: schedule.id,
          del_flg: true,
          updated_by: userCode,
          updated_at: new Date()
        };
        const dbAttendees = await attendeeService.getAttendeeByScheduleId(schedule.id);
        if (dbAttendees.length > 0) {
          await attendeeService.deleteAttendees(delData);
        }
        const dbScheduleReminders = await scheduleReminderService.getScheduleReminderByScheduleId(schedule.id);
        if (dbScheduleReminders.length > 0) {
          await scheduleReminderService.deleteScheduleReminders(delData);
        }
        await Schedule.deleteSchedule(delData);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }


  static async getScheduleByCode(schedule_code) {
    return new Promise((resolve, reject) => {
      Schedule.getScheduleByCode(schedule_code, (err, schedules) => {
        if (err) {
          reject(err);
        } else {
          resolve(schedules);
        }
      });
    });
  }
}

module.exports = ScheduleService;
