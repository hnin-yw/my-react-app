const crypto = require('crypto');

const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Attendee = require('../models/Attendee');

class UserService {
  static async login(req) {
    req.password = this.pwdEncodeSHA(req.password);
    return new Promise((resolve, reject) => {
      User.login(req, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static pwdEncodeSHA(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedValue = hash.digest('hex');
    return hashedValue;
  }

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

  static async getUserByUserName(user_name) {
    return new Promise((resolve, reject) => {
      User.getUserByUserName(user_name, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  static async saveUser(userData, userCode) {
    try {
        const existingUser = await this.getUserByUserName(userData.user_name);
        if (existingUser.length > 0) {
            return false;
        } else {
            const user_code = await this.getUserCode();
            userData.user_code = user_code;
            userData.password = this.pwdEncodeSHA(userData.password);
            userData.del_flg = false;
            userData.created_by = userCode;
            userData.created_at = new Date();
            userData.updated_by = userCode;
            userData.updated_at = new Date();
            User.saveUser(userData);
            return true;
        }
    } catch (error) {
        console.error("Error occurred while saving user:", error);
        throw error;
    }
}

  static async updateUser(userData, userCode) {
    try {
      userData.updated_by = userCode;
      userData.updated_at = new Date();
      User.updateUser(userData);

      return userData.id;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId, userCode) {
    try {
      const dbUserData = await this.getUserById(userId);
      const scheduleData = await Schedule.getScheduleByUserCode(dbUserData[0].user_code);
      const attendeeData = await Attendee.getAttendeeByUserCode(dbUserData[0].user_code);
      if (
        scheduleData.length > 0
        || attendeeData.length > 0
        || dbUserData[0].user_code === userCode
      ) {
        return false;
      } else {
        const userData = {
          id: userId,
          del_flg: true,
          updated_by: userCode,
          updated_at: new Date()
        };
        User.deleteUser(userData);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getUserCode() {
    try {
      const userData = await new Promise((resolve, reject) => {
        User.getUserCode((err, userData) => {
          if (err) {
            reject(err);
          } else {
            resolve(userData);
          }
        });
      });

      let user_code = "U000001";;
      if (userData != null && userData.length > 0) {
        const nextNumber = parseInt(userData[0].user_code.substring(1)) + 1;
        user_code = "U" + nextNumber.toString().padStart(6, '0');
      }
      return user_code;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
