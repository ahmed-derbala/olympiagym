const express = require('express');
const router = express.Router();
const appRootPath = require('app-root-path');
const authCtrl = require(`${appRootPath}/src/auth/auth.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`${appRootPath}/utils/error`).validatorCheck;
const { authenticate } = require(`${appRootPath}/middlewares/authmw`)




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express',message:null });
});

/* GET home page. */
router.post('/', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express',message:null });
});
/*
router.post('/signup',
  [
    check('user').exists(),
    check('user.email').isEmail(),
    check('user.password').isString().notEmpty(),
    check('user.phones').isArray(),
    check('user.phones.*.countryCode').isString().notEmpty(),
    check('user.phones.*.shortNumber').isString().notEmpty()

  ],
  validatorCheck,
  authCtrl.signup)

router.post('/signin',
  [
    check('user.email').isEmail(),
    check('user.password').isString().notEmpty()
  ],
  validatorCheck,
  authCtrl.signin)

router.post('/signout',
  auth(),
  authCtrl.signout)
*/
module.exports = router;
