const { validationResult } = require('express-validator');
const { log } = require(`./log`)

exports.errorHandler = (params) => {
    if (!params) params = {}
    if (!params.req) params.req = {}

    let status = 500
    let errObject = {}
    if (params.err) {
        errObject.error = params.err
        if (typeof params.err == 'object') {
            if (params.err.errors) errObject.error = params.err.errors
            if (params.err.message) {
                errObject.message = params.err.message
            }
            if (params.err.name) {
                if (params.err.name == 'ValidationError') {
                    status = 409
                }
                if (params.err.name == 'TokenExpiredError') {
                    status = 401
                }
            }
        } 
    }
    errObject.status = status

    //console.error(`${JSON.stringify(errObject)}`, 'errObject errorHandler')
    errObject.req = params.req
    errObject.level = 'error'
    if (!errObject.message) errObject.message = 'error'
    if (params.res) {
        return params.res.status(status).json(errObject)
    }
    return log(errObject)
};

/**
 * checking errors returned by validator, it should be called directly after validator on routes
 */
exports.validatorCheck = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error({
            label: 'VALIDATION_ERROR',
            message: JSON.stringify(errors.errors),
            body: req.body,
        });
        return res.status(422).json({ message: `validation error`, err: errors.errors });
    }
    return next();
};
