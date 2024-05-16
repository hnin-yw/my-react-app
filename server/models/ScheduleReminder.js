const db = require('../db');

const selectByScheduleIdQuery = "SELECT * FROM schedule_reminders WHERE del_flg = 0 AND schedule_id = ?";
const del_upd_query = "UPDATE schedule_reminders SET del_flg = ?, updated_by = ?, updated_at = ? WHERE schedule_id = ?";
const ins_query = "INSERT INTO schedule_reminders (schedule_id, schedule_reminder_time, schedule_reminder_type, noti_method_flg, del_flg, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

class ScheduleReminder {
  static getScheduleReminderByScheduleId(id, callback) {
    db.query(selectByScheduleIdQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static saveScheduleReminder(req, callback) {
    const values = [req.schedule_id
      , req.schedule_reminder_time
      , req.schedule_reminder_type
      , req.noti_method_flg
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

  static async deleteScheduleReminders(req) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }
}

module.exports = ScheduleReminder;
