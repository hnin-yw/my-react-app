const scheduleReminder = require('../models/ScheduleReminder');

class ScheduleReminderService {
  static async getScheduleReminderByScheduleId(id) {
    return new Promise((resolve, reject) => {
      scheduleReminder.getScheduleReminderByScheduleId(id, (err, reminders) => {
        if (err) {
          reject(err);
        } else {
          resolve(reminders);
        }
      });
    });
  }

  static async deleteScheduleReminders(req) {
    try {
      scheduleReminder.deleteScheduleReminders(req);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ScheduleReminderService;
