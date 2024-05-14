const db = require('../db');

const selectAllQuery = "SELECT s.*,u.user_name,(SELECT a.del_flg FROM attendees a WHERE a.schedule_id = s.id AND a.user_code = ?) AS attendee_del_flg FROM schedules s JOIN users u ON s.user_code = u.user_code WHERE (s.user_code = ? OR (s.user_code <> ? AND s.group_code = ? AND s.other_visibility_flg = false) OR s.id IN (SELECT a.schedule_id FROM attendees a WHERE a.user_code = ? AND a.del_flg = false)) AND s.del_flg = false ORDER BY s.schedule_start_date_time ASC";
const selectByAttendeesByScheduleQuery = "SELECT u.* FROM attendees a JOIN users u ON a.user_code = u.user_code WHERE a.del_flg = 0 AND a.id = ?";
const selectScheduleByUserQuery = "SELECT * FROM schedules WHERE del_flg = 0 AND user_code = ?";

class Schedule {
  static getAll(req, callback) {
    const values = [req.user_code, req.user_code, req.user_code, req.group_code, req.user_code];

    db.query(selectAllQuery, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getAllAttendeesBySchedule(id, callback) {
    db.query(selectByAttendeesByScheduleQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async getScheduleByUserCode(user_code) {
    return new Promise((resolve, reject) => {
      db.query(selectScheduleByUserQuery, [user_code], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
}

module.exports = Schedule;
