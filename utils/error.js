const { validationResult } = require('express-validator');

exports.errorHandler = (params) => {
    //console.log(params,'params err')
    let status = 500
    let response = {}
    if (params.err) {
        response.error = params.err
        if(params.err.errors)response.error=params.err.errors
        if (params.err.message) {
            response.message = params.err.message
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
    response.status=status

    console.error(`${JSON.stringify(response)}`.black.bgRed)
    if (params.res) {
        return params.res.status(status).json(response)
    }
   // return { status, message: 'error', error: params.err }
   return response
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
