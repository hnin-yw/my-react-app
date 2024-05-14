const groupService = require('../services/groupService');

class GroupController {
  static async getAllGroups(req, res) {
    try {
      const groups = await groupService.getAllGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getGroupById(req, res) {
    try {
      const groupId = req.params.id;
      const group = await groupService.getGroupById(groupId);
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getGroupCode(req, res) {
    try {
      const groups = await groupService.getGroupCode();
      res.json(groups);
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async saveGroup(req, res) {
    try {
      const gpData = req.body;
      const dbGpId = await groupService.saveGroup(gpData);
      res.status(200).json({ statusCode: 200, message: 'グループは正常に登録されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateGroup(req, res) {
    try {
      const gpData = req.body;
      await groupService.updateGroup(gpData);
      res.status(200).json({ statusCode: 200, message: 'グループは正常に更新されました。' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteGroup(req, res) {
    try {
      const gpId = req.params.id;;
      const isDel = await groupService.deleteGroup(gpId);
      if (isDel) {
        res.status(200).json({ statusCode: 200, message: 'グループは正常に削除されました。' });
      } else {
        res.status(201).json({ statusCode: 201, message: 'このグループは削除できません。' });

      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = GroupController;
