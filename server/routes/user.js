const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//create, read, update, delete
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);

router.get('/:id', userController.delete);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/viewuser/:id', userController.user);

//Router
router.get('', (req, res) => {
    res.render('home');
});

module.exports = router;