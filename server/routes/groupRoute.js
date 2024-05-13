const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getAllGroups);
router.get('/code', groupController.getGroupCode);
router.get('/edit/:id', groupController.getGroupById);
router.post('/', groupController.saveGroup);
router.put('/update', groupController.updateGroup);
router.put('/delete/:id', groupController.deleteGroup);

module.exports = router;
