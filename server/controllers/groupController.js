const groupService = require('../services/groupService');

class GroupController {
  static async getAllGroups(req, res) {
    try {
      console.log("GroupController",req);
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
      res.status(201).json({ id: dbGpId, message: 'Group created successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateGroup(req, res) {
    try {
      const gpData = req.body;
      await groupService.updateGroup(gpData);
      res.status(200).json({ id: req.body.id, message: 'Group updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteGroup(req, res) {
    try {
      const gpId = req.params.id;
      await groupService.deleteGroup(gpId);
      res.status(200).json({ id: gpId, message: 'Group deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = GroupController;
