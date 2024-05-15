const db = require('../db');

const selectByScheduleIdQuery = "SELECT * FROM attendees WHERE del_flg = 0 AND schedule_id = ?";
const selectAttendeeByUserCodeQuery = "SELECT * FROM attendees WHERE del_flg = 0 AND user_code = ?";
const del_upd_query = "UPDATE attendees SET del_flg = ?, updated_by = ?, updated_at = ? WHERE schedule_id = ?";

class Attendee {
  static getAttendeeByScheduleId(id, callback) {
    db.query(selectByScheduleIdQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
  static async getAttendeeByUserCode(user_code) {
    return new Promise((resolve, reject) => {
      db.query(selectAttendeeByUserCodeQuery, [user_code], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async deleteAttendees(req) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }
}

module.exports = Attendee;
