const morgan = require('morgan');
const appConf = require(`../configs/app.config`);
const { log } = require(`./log`)
const _ = require('lodash');
const { errorHandler } = require('./error');


morgan.token('userIp', (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);

morgan.token('user', (req) => {
    if (!req.user) return JSON.stringify({});
    return JSON.stringify(req.user);
});

morgan.token('browser', (req) => {
    return req.useragent.browser;
});

morgan.token('os', (req) => {
    return req.useragent.os;
});

morgan.token('platform', (req) => {
    return req.useragent.platform;
});

morgan.token('isBot', (req) => {
    return req.useragent.isBot;
});

morgan.token('referrer', (req) => {
    return req.headers.referrer || req.headers.referer;
});

morgan.token('body', (req) => {
    if (req.body.password) {
        req.body.password = '*****';
    }
    return JSON.stringify(req.body);
});
morgan.token('nl', (req) => {
    //new line
    return '\n';
});

morgan.token('origin', (req) => {
    return req.headers.origin;
});

morgan.token('tid', (req) => {
    return req.headers.tid;
});

stream = {
    write: function (req, encoding) {
        try {
            req = JSON.parse(req)
        }
        catch (e) {
            //console.log(req,'req')
            return errorHandler({ err: 'REQ_NOT_PARSED', req })
        }

        let level = 'error'
        if (_.inRange(req.status, 200, 399)) level = 'debug'
        if (_.inRange(req.status, 400, 499)) level = 'warn'

        switch (level) {
            case 'error':
                errorHandler({ req });
                break

            default:
                log({ req, level })
        }
    },
};

let morganLogger = () => {
    return morgan(appConf.morgan.tokenString, { stream })
}
module.exports = morganLogger