const db = require('../db');

const selectAllQuery = "SELECT s.* FROM schedules s WHERE (s.user_code = ? OR (s.user_code <> ? AND s.group_code = ? AND s.other_visibility_flg = false) OR s.id IN (SELECT a.schedule_id FROM attendees a WHERE a.user_code = ? AND a.del_flg = false)) AND s.del_flg = false ORDER BY s.schedule_start_date_time ASC";

class Schedule {
  static getAll(req, callback) {
    console.log("Schedule", req);
    const values = [req.params.user_code, req.params.user_code, req.params.group_code, req.params.user_code];
    db.query(selectAllQuery, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
}

module.exports = Schedule;
