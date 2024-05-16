const group = require('../models/Group');
const user = require('../models/User');

class GroupService {
  static async getAllGroups() {
    return new Promise((resolve, reject) => {
      group.getAll((err, groups) => {
        if (err) {
          reject(err);
        } else {
          resolve(groups);
        }
      });
    });
  }

  static async getGroupById(id) {
    return new Promise((resolve, reject) => {
      group.getGroupById(id, (err, group) => {
        if (err) {
          reject(err);
        } else {
          resolve(group);
        }
      });
    });
  }

  static async saveGroup(gpData, userCode) {
    try {
      const group_code = await this.getGroupCode();
      gpData.group_code = group_code;
      gpData.del_flg = false;
      gpData.created_by = userCode;
      gpData.created_at = new Date();
      gpData.updated_by = userCode;
      gpData.updated_at = new Date();

      const userId = await new Promise((resolve, reject) => {
        group.saveGroup(gpData, (err, userId) => {
          if (err) {
            reject(err);
          } else {
            resolve(userId);
          }
        });
      });
      return userId;
    } catch (error) {
      throw error;
    }
  }

  static async updateGroup(gpData, userCode) {
    try {
      gpData.updated_by = userCode;
      gpData.updated_at = new Date();

      group.updateGroup(gpData);

      return gpData.id;
    } catch (error) {
      throw error;
    }
  }

  static async deleteGroup(gpId, userCode) {
    try {
      const dbGroupData = await this.getGroupById(gpId);
      const userData = await user.getUserByGroupCode(dbGroupData[0].group_code);
      if (userData.length > 0) {
        return false;
      } else {
        const gpData = {
          id: gpId,
          del_flg: true,
          updated_by: userCode,
          updated_at: new Date()
        };
        group.deleteGroup(gpData);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getGroupCode() {
    try {
      const gpData = await new Promise((resolve, reject) => {
        group.getGroupCode((err, gpData) => {
          if (err) {
            reject(err);
          } else {
            resolve(gpData);
          }
        });
      });

      let group_code = "G000001";
      if (gpData != null && gpData.length > 0) {
        const nextNumber = parseInt(gpData[0].group_code.substring(1)) + 1;
        group_code = "G" + nextNumber.toString().padStart(6, '0');
      }
      return group_code;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GroupService;
