const Schedule = require('../models/Schedule');

class ScheduleService {
  static async getAllSchedules(req) {
    return new Promise((resolve, reject) => {
      console.log("ScheduleService",req);
      Schedule.getAll(req, (err, schedules) => {
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
