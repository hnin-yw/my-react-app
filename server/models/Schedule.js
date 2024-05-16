const db = require('../db');

const selectAllQuery = "SELECT s.*,u.user_name,(SELECT a.del_flg FROM attendees a WHERE a.schedule_id = s.id AND a.user_code = ?) AS attendee_del_flg FROM schedules s JOIN users u ON s.user_code = u.user_code WHERE (s.user_code = ? OR (s.user_code <> ? AND s.group_code = ? AND s.other_visibility_flg = false) OR s.id IN (SELECT a.schedule_id FROM attendees a WHERE a.user_code = ? AND a.del_flg = false)) AND s.del_flg = false ORDER BY s.schedule_start_date_time ASC";
const selectScheduleByIdsQuery = "SELECT * FROM schedules s WHERE s.del_flg = false and id IN (?) ORDER BY s.schedule_start_date_time ASC";
const selectByAttendeesByScheduleQuery = "SELECT u.* FROM attendees a JOIN users u ON a.user_code = u.user_code WHERE a.del_flg = 0 AND a.schedule_id = ?";
const selectScheduleByUserQuery = "SELECT * FROM schedules WHERE del_flg = 0 AND user_code = ?";
const selectScheduleByCodeQuery = "SELECT * FROM schedules WHERE del_flg = false and schedule_code = ?";
const deleteScheduleQuery = "UPDATE schedules SET del_flg = ?, updated_by = ?, updated_at = ? WHERE id = ?";
const schedule_code_query = "SELECT * FROM schedules ORDER BY schedule_code DESC LIMIT 1";
const ins_query = "INSERT INTO schedules (schedule_code, group_code, user_code, schedule_title, schedule_start_date_time, schedule_end_date_time, allday_flg, repeat_type, repeat_until, repeat_day_of_week, repeat_type_of_month, schedule_display_flg, location, meet_link, schedule_description, schedule_theme_color, other_visibility_flg, event_flg, schedule_status_flg, guest_permission_flg, del_flg, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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

  static async getScheduleByCode(schedule_code, callback) {
    db.query(selectScheduleByCodeQuery, [schedule_code], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getScheduleByIds(req, callback) {
    const placeholders = req.map(() => '?').join(',');
    const sql = selectScheduleByIdsQuery.replace('?', placeholders);
    db.query(sql, req, (err, results) => {
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

  static saveSchedule(req, callback) {
    const values = [req.schedule_code
      , req.group_code
      , req.user_code
      , req.schedule_title
      , req.schedule_start_date_time
      , req.schedule_end_date_time
      , req.allday_flg
      , req.repeat_type
      , req.repeat_until
      , req.repeat_day_of_week
      , req.repeat_type_of_month
      , req.schedule_display_flg
      , req.location
      , req.meet_link
      , req.schedule_description
      , req.schedule_theme_color
      , req.other_visibility_flg
      , req.event_flg
      , req.schedule_status_flg
      , req.guest_permission_flg
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

  static async deleteSchedule(req, callback) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(deleteScheduleQuery, values);
  }

  static getScheduleCode(callback) {
    db.query(schedule_code_query, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }
}

module.exports = Schedule;
