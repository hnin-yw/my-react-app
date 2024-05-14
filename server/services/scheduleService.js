const Schedule = require('../models/Schedule');

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
}

module.exports = ScheduleService;
