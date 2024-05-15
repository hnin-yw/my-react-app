
const attendee = require('../models/Attendee');

class AttendeeService {
  static async getAttendeeByScheduleId(id) {
    return new Promise((resolve, reject) => {
      attendee.getAttendeeByScheduleId(id, (err, attendees) => {
        if (err) {
          reject(err);
        } else {
          resolve(attendees);
        }
      });
    });
  }

  static async deleteAttendees(req) {
    try {
      attendee.deleteAttendees(req);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AttendeeService;
