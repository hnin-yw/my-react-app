const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.saveUser);
router.get('/edit/:id', userController.getUserById);

module.exports = router;
