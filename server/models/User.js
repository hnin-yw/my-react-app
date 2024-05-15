const db = require('../db');

const selectAllQuery = "SELECT u.*, g.group_name FROM users u JOIN user_groups g ON u.group_code = g.group_code WHERE u.del_flg = 0 ORDER BY u.user_code DESC";
const selectByIdQuery = "SELECT u.*, g.group_name FROM users u JOIN user_groups g ON u.group_code = g.group_code WHERE u.del_flg = 0 AND u.id = ?";
const loginQuery = "SELECT * FROM users WHERE user_name= ? AND password = ?";
const selectUserByGroupCodeQuery = "SELECT * FROM users WHERE del_flg = 0 AND group_code = ?";

const user_code_query = "SELECT * FROM users ORDER BY user_code DESC LIMIT 1";
const ins_query = "INSERT INTO users (group_code, user_code, user_name, password, user_first_name, user_last_name, post_code, address, tel_number, email, del_flg, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const upd_query = "UPDATE users SET user_first_name = ?, user_last_name = ?, post_code = ?, address = ?, tel_number = ?, email = ?, updated_by = ?, updated_at = ? WHERE id = ?";
const del_upd_query = "UPDATE users SET del_flg = ?, updated_by = ?, updated_at = ? WHERE id = ?";

class User {

  static login(req, callback) {
    const values = [req.user_name, req.password];
    db.query(loginQuery, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getAll(callback) {
    db.query(selectAllQuery, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getUserById(id, callback) {
    db.query(selectByIdQuery, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async getUserByGroupCode(group_code) {
    return new Promise((resolve, reject) => {
      db.query(selectUserByGroupCodeQuery, [group_code], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static getUserCode(callback) {
    db.query(user_code_query, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }

  static saveUser(req, callback) {
    const values = [
      req.group_code,
      req.user_code,
      req.user_name,
      req.password,
      req.user_first_name,
      req.user_last_name,
      req.post_code,
      req.address,
      req.tel_number,
      req.email,
      req.del_flg, req.created_by, req.created_at, req.updated_by, req.updated_at];
    db.query(ins_query, values, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  }

  static updateUser(req) {
    const values = [
      req.user_first_name,
      req.user_last_name,
      req.post_code,
      req.address,
      req.tel_number,
      req.email, req.updated_by, req.updated_at, req.id];
    db.query(upd_query, values);
  }

  static deleteUser(req) {
    const values = [req.del_flg, req.updated_by, req.updated_at, req.id];
    db.query(del_upd_query, values);
  }
}

module.exports = User;
