const db = require('../db');

const selectByScheduleIdQuery = "SELECT a.user_code,u.email FROM attendees a JOIN users u ON a.user_code = u.user_code WHERE a.del_flg = 0 AND a.schedule_id = ?";
const selectAttendeeByUserCodeQuery = "SELECT * FROM attendees WHERE del_flg = 0 AND user_code = ?";
const del_upd_query = "UPDATE attendees SET del_flg = ?, updated_by = ?, updated_at = ? WHERE schedule_id = ?";
const ins_query = "INSERT INTO attendees (schedule_id, user_code, response_status_flg, response_time, del_flg, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const del_query = "DELETE FROM attendees WHERE schedule_id = ?";

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

  static saveAttendee(req, callback) {
    const values = [req.schedule_id
      , req.user_code
      , req.response_status_flg
      , req.response_time
      , req.del_flg
      , req.created_by
      , req.created_at
      , req.updated_by
      , req.updated_at];
    db.query(ins_query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }

  //Dynamic Delete
  static async deleteAttendees(req) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }

  //Delete Records before Update
  static async deleteAttendeesByScheduleId(req) {
    db.query(del_query, [req]);
  }
}

module.exports = Attendee;
