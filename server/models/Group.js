const db = require('../db');

const selectAllQuery = "SELECT * FROM user_groups WHERE del_flg = 0";
const selectByIdQuery = "SELECT * FROM user_groups WHERE del_flg = 0 AND id = ?";
const gp_code_query = "SELECT * FROM user_groups ORDER BY group_code DESC LIMIT 1";
const ins_query = "INSERT INTO user_groups (group_code, group_name, del_flg, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
const upd_query = "UPDATE user_groups SET group_name = ?, updated_by = ?, updated_at = ? WHERE id = ?";
const del_upd_query = "UPDATE user_groups SET del_flg = ?, updated_by = ?, updated_at = ? WHERE id = ?";

class Group {
  static getAll(callback) {
    db.query(selectAllQuery, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getGroupById(id, callback) {
    db.query(selectByIdQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getGroupCode(callback) {
    db.query(gp_code_query, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }

  static saveGroup(req, callback) {
    const values = [req.group_code, req.group_name, req.del_flg, req.created_by, req.created_at, req.updated_by, req.updated_at];
    db.query(ins_query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }

  static updateGroup(req) {
    const values = [req.group_name, req.updated_by, req.updated_at, req.id];
    db.query(upd_query, values);
  }

  static deleteGroup(req, callback) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }
}

module.exports = Group;
