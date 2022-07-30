const express = require('express');
const router = express.Router();
const appRootPath = require('app-root-path');
const authCtrl = require(`${appRootPath}/src/auth/auth.controller`)
const { check, query, param } = require('express-validator');
const validatorCheck = require(`${appRootPath}/utils/error`).validatorCheck;
const auth = require(`${appRootPath}/utils/auth`).auth




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('auth/views/signup', { title: 'Express',message:null });
});


module.exports = router;
