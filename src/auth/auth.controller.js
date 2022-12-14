const mongoose = require('mongoose');
const appRootPath = require('app-root-path');
const Users = require(`../users/users.schema`)
const Sessions = require(`../sessions/sessions.schema`)
const bcrypt = require('bcrypt');
const { errorHandler } = require('../../utils/error');
const jwt = require('jsonwebtoken');
const authConfig = require(`../../configs/auth.config`)
const authSrvc = require(`./auth.service`)

module.exports.signup = async (req, res) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    console.log(req.body, 'req.body');
    const user = {}
    if (req.body.user) user = req.body.user
    else {
        user.email = req.body['user.email']
        user.password = req.body['user.password']
        user.profile = {}
        user.phones = []
    }
    return authSrvc.signup({ user })
        .then(result => {
            return res.status(result.status).json(result)
        })
        .catch(err => errorHandler({ err, res }))
}

module.exports.signin = async (req, res) => {
    req.body = JSON.parse(JSON.stringify(req.body))
    console.log(req.body, 'req.body');
    const user = {}
    if (req.body.user) user = req.body.user
    else {
        user.email = req.body['user.email']
        user.password = req.body['user.password']
        user.profile = {}
        user.phones = []
    }
    return authSrvc.signin({ user, req })
        .then(result => {
            if (req.query.render == 'true') return res.redirect('/');

            return res.status(result.status).json(result)
        })
        .catch(err => errorHandler({ err, res }))
}

module.exports.signout = async (req, res) => {
    return Sessions.deleteOne({ token: req.headers.token })
        .then(deletedSession => {
            return res.status(200).json({ msg: 'singedout', data: deletedSession })
        })
        .catch(err => errorHandler({ err, res }))
}