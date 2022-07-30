const logger = require('morgan');


/**
 * this styles the log of the request
 * @param {*} params 
 * @returns 
 */
exports.formatToken = () => {

    logger.token('userIp', (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    logger.token('userId', (req) => {
        if (req.user) {
            return req.user._id;
        }
        return '-';
    });

    logger.token('userEmail', (req) => {
        if (req.user) {
            return req.user.email;
        }
        return '-';
    });

    logger.token('browser', (req) => {
        return req.useragent.browser;
    });

    logger.token('os', (req) => {
        return req.useragent.os;
    });

    logger.token('platform', (req) => {
        return req.useragent.platform;
    });

    logger.token('isBot', (req) => {
        return req.useragent.isBot;
    });

    logger.token('referrer', (req) => {
        return req.headers.referrer || req.headers.referer;
    });

    logger.token('body', (req) => {
        if (req.body.password) {
            req.body.password = '*****';
        }
        return JSON.stringify(req.body);
    });
    //new line
    logger.token('nl', (req) => {
        return '\n';
    });

    logger.token('origin', (req) => {
        return req.headers.origin;
    });

    return logger
}