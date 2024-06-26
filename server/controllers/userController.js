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
      const userCode = req.cookies.userCode;
      const userData = req.body;
      const isSave = await userService.saveUser(userData, userCode);
      if (isSave) {
        res.status(200).json({ status: 200, message: 'ユーザは正常に登録されました。' });
      } else {
        res.status(201).json({ status: 201, message: 'ユーザ情報は登録できません。同じ「ユーザー名・ログイン名 」のユーザ情報が存在しています。' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const userCode = req.cookies.userCode;
      const userData = req.body;
      await userService.updateUser(userData, userCode);
      res.status(200).json({ status: 200, message: 'ユーザは正常に更新されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userCode = req.cookies.userCode;
      const userId = req.params.id;;
      const isDel = await userService.deleteUser(userId, userCode);
      if (isDel) {
        res.status(200).json({ status: 200, message: 'ユーザは正常に削除されました。' });
      } else {
        res.status(201).json({ status: 201, message: 'このユーザは削除できません。' });

      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
