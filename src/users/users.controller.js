const mongoose = require('mongoose');
const Users = require(`./users.schema`)
const usersSrvc = require('./users.service')





module.exports.getUsers = async (req, res) => {
    return usersSrvc.getUsers()
        .then(users => {
            return res.status(200).json({ msg: 'users', data: users })
        })
        .catch(err => errorHandler({ err, res }))
}