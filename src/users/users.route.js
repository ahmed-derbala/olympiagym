const express = require('express');
const router = express.Router();
const users_ctrl = require(`${appRootPath}/src/users/users_ctrl`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`${appRootPath}/utils/error`).validatorCheck;
const auth = require(`${appRootPath}/utils/auth`).auth




/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/


router.get('/',
  auth(),
  users_ctrl.getUsers)

/*
router.post('/signin',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
auth_ctrl.signin)
*/

/*
router.post('/signup',
[
    check('email').isEmail(),
    check('password').isString().notEmpty()
],
validatorCheck,
authController.signup)*/

module.exports = router;
