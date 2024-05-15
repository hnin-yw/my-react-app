const db = require('../db');

const selectByScheduleIdQuery = "SELECT * FROM schedule_reminders WHERE del_flg = 0 AND schedule_id = ?";
const del_upd_query = "UPDATE schedule_reminders SET del_flg = ?, updated_by = ?, updated_at = ? WHERE schedule_id = ?";

class ScheduleReminder {
  static getScheduleReminderByScheduleId(id, callback) {
    db.query(selectByScheduleIdQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async deleteScheduleReminders(req) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }
}

module.exports = ScheduleReminder;
