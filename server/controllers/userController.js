const userService = require('../services/userService');

class UserController {
  static async login(req, res) {
    try {
      req = req.body;
      const user = await userService.login(req);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserCode(req, res) {
    try {
      const users = await userService.getUserCode();
      res.json(users);
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async saveUser(req, res) {
    try {
      const userData = req.body;
      const dbUserId = await userService.saveUser(userData);
      res.status(200).json({ statusCode: 200, message: 'ユーザは正常に登録されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const userData = req.body;
      await userService.updateUser(userData);
      res.status(200).json({ statusCode: 200, message: 'ユーザは正常に更新されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;;
      const isDel = await userService.deleteUser(userId);
      if (isDel) {
        res.status(200).json({ statusCode: 200, message: 'ユーザは正常に削除されました。' });
      } else {
        res.status(201).json({ statusCode: 201, message: 'このユーザは削除できません。' });

      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
