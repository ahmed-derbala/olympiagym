const express = require('express');
const router = express.Router();
const appRootPath = require('app-root-path');
const authCtrl = require(`${appRootPath}/src/auth/auth.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`${appRootPath}/utils/error`).validatorCheck;
const auth = require(`${appRootPath}/utils/auth`).auth






router.post('/signup',
  [
  //  check('user').exists(),
    check('email').isEmail(),
    check('password').isString().notEmpty(),
 //   check('user.phones').isArray(),
  //  check('user.phones.*.countryCode').isString().notEmpty(),
  //  check('user.phones.*.shortNumber').isString().notEmpty()

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

module.exports = router;
