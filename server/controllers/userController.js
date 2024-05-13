const userService = require('../services/userService');

class UserController {
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

  static async saveUser(req, res) {
    try {
      const userData = req.body; // Assuming user data is sent in the request body
      const userId = await userService.addUser(userData);
      res.status(201).json({ id: userId, message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;
