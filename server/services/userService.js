const User = require('../models/User');

class UserService {
  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      User.getAll((err, users) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  }

  static async getUserById(id) {
    return new Promise((resolve, reject) => {
      User.getUserById(id, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static async saveUser(userData) {
    return new Promise((resolve, reject) => {
      User.create(userData, (err, userId) => {
        if (err) {
          reject(err);
        } else {
          resolve(userId);
        }
      });
    });
  }
}

module.exports = UserService;
