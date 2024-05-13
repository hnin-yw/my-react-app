const db = require('../db');

const selectAllQuery = "SELECT u.*, g.group_name FROM users u JOIN user_groups g ON u.group_code = g.group_code WHERE u.del_flg = 0";
const selectByIdQuery = "SELECT u.*, g.group_name FROM users u JOIN user_groups g ON u.group_code = g.group_code WHERE u.del_flg = 0 AND u.id = ?";

class User {
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

  static getById(id, callback) {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      callback(null, results[0]);
    });
  }

  static saveUser(newUser, callback) {
    db.query('INSERT INTO users SET ?', newUser, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results.insertId); // Pass the inserted ID back
    });
  }
}

module.exports = User;
