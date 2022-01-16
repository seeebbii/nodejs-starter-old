const express = require('express');
const userController = require('../controller/userController');
const loginController = require('../controller/loginController');
const router = express.Router();

const validate = require('../auth/token_validation');


router.get('/', (req, res, next) => {
    res.json({
        success: true,
        message: "Welcome to the endpoint"
    });
});

router.post('/users', userController.createUser);
router.get('/users', validate.checkToken, userController.getUsers);
router.get('/users/:id', validate.checkToken, userController.getUserById);
router.post('/users/:id', validate.checkToken, userController.updateUser);
router.delete('/users/delete/:id', validate.checkToken, userController.deleteUser);

router.post('/login', loginController.login);

module.exports = router;