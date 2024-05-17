const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.post('/', userController.saveUser);
router.get('/edit/:id', userController.getUserById);
router.post('/login', userController.login);
router.post('/', userController.saveUser);
router.put('/update', userController.updateUser);
router.put('/delete/:id', userController.deleteUser);

module.exports = router;
