/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */

const appRootPath = require('app-root-path');
const winston = require('winston'); //logging module
require('winston-mongodb');
const Transport = require('winston-transport'); //winston custom transport
const packagejson = require(`${appRootPath}/package.json`);
const nodemailer = require('nodemailer');
const tColors = require('colors/safe');
const appConfig = require(`../configs/app.config`)
const { mainMongoDBConfig } = require(`../configs/mongo.config`)

/*
const emailSignature = `<br><br>------------------------
${prefs.company.name} ${prefs.company.description} ------------------------<br>
telephone: ${prefs.company.phone}  email: ${prefs.company.email}<br><br>
address: ${prefs.company.address}<br><br>
${prefs.company.logo}`;
*/
//log(name_of_file).level() to save the log in /logs/name_of_file.log
//log().level() to save the log in /logs/project_name.log
let log = exports.log = (params) => {
  if (!params) params = {}
  //params.filename
  //console.log('\n');//to make console more readable
  /*const myFormat2 = winston.format.printf(({ ip, userAgent, level, message, label, route, where, page, search, count, decoded, info, timestamp, token,request }) => {
        return JSON.stringify({ timestamp, level, message, decoded, info, where, page, search, count, route, ip, userAgent, token,request })
    });*/
  const myFormat = winston.format.printf((msg) => JSON.stringify(msg));
  if (!params.filename) params.filename = `${packagejson.name}`;

  let options = {
    file: {
      level: 'verbose',
      filename: `${appRootPath}/logs/${params.filename}.log`,
      //timestamp: true,
      handleExceptions: true,
      maxsize: 1000000, //1MB, 1 million = 1 mb
      maxFiles: 2,
      json: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD--HH:mm:ss.SSS',
        }),
        myFormat,
      ),
    },
    console: {
      level: 'debug',
      json: true,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD--HH:mm:ss.SSS',
        }),
        //myFormat,
        winston.format.colorize(),
        winston.format.json(),
        winston.format.simple(),
      ),
    },
    mongoDB: {
      db: mainMongoDBConfig.uri,
      options: {
        useUnifiedTopology: true
      },
      decolorize: true,
    }
  };
  console.log(); //to make terminal more readable

  //winston.add(new winston.transports.MongoDB(options));

  // instantiate a new Winston Logger with the settings defined above
  /* if (prefs.emails.sendLogs == true) {
     return winston.createLogger({
       transports: [
         new winston.transports.File(options.file),
         new winston.transports.Console(options.console),
         new EmailTransport(),
         new winston.transports.MongoDB(options.mongoDB)
       ],
       exitOnError: false, // do not exit on handled exceptions
     });
   } else {*/
  return winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
      new winston.transports.MongoDB(options.mongoDB)
    ],
    exitOnError: false,
  })[params.level](params)
  //}
}

//stream are the output to console
//attached to morgan, express logger (app.js)
log.stream = {
  write: function (request, encoding) {
    let statusCode = request.slice(0, 1);
    if (statusCode == 2) {
      log({level:'debug', message: tColors.bgGreen(request.black) });

      console.log(); //to make console more readable
    } else if (statusCode == 3) {
      log({ message: tColors.bgCyan(request.black) });
      console.log(); //to make console more readable
    } else if (statusCode == 4) {
      //  log().warn({ message: tColors.bgYellow(request.black),metaKey:'rrr' });
      console.log(); //to make console more readable
    } else {
      errorHandler(request);
      console.log(); //to make console more readable
    }
    //checkin responsetimealert
    let rt = request.slice(request.indexOf('[*') + 2, request.indexOf('*]')); //rt like response time
    if (parseInt(rt) > appConfig.responseTimeAlert) {
      // log().warn({ message: `request taking more than ${prefs.responseTimeAlert} ms`, request })
    }
  },
};

//sending emails with winston on production
class EmailTransport extends Transport {
  constructor(opts) {
    super(opts);
  }
  async log(info, callback) {
    /*setImmediate(() => {
            this.emit('logged', info);
        });*/
    let transporter = nodemailer.createTransport({
      host: prefs.emails.host,
      port: prefs.emails.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: prefs.emails.noreply.email,
        pass: prefs.emails.noreply.password,
      },
    });
    let to;
    switch (info.level) {
      case 'error':
        if (config.NODE_ENV == 'production' || config.NODE_ENV == 'staging') {
          //    if (config.NODE_ENV != 'development') {
          to = prefs.emails.error;
        } else {
          to = prefs.emails.developer;
        }
        break;
      case 'warn':
        if (config.NODE_ENV == 'production' || config.NODE_ENV == 'staging') {
          //    if (config.NODE_ENV != 'development') {
          to = prefs.emails.warn;
        } else {
          to = prefs.emails.developer;
        }
        break;
      case 'info':
        if (config.NODE_ENV == 'production' || config.NODE_ENV == 'staging') {
          //    if (config.NODE_ENV != 'development') {
          to = prefs.emails.info;
        } else {
          to = prefs.emails.developer;
        }
        break;
      case 'verbose':
        return;
    }
    return transporter.sendMail(
      {
        from: `${packagejson.name}  <${prefs.emails.noreply.email}>`, // sender address
        to,
        subject: `${packagejson.name} | ${packagejson.version} | ${info.level} | ${config.NODE_ENV}`,
        html: `
            ${packagejson.name} ${packagejson.version} <br>
            ${info.level.toString()} <br>
            route     : ${info.route} <br><br>
            message   : ${info.message} <br><br><br>
            res       : ${info.res} <br><br><br>
            user      : ${info.user} <br><br><br>
            account   : ${info.account} <br><br><br>
            NODE_ENV  : ${config.NODE_ENV} <br>
            path      : ${appRootPath} <br>
            caller    : ${info.caller} <br>
            back_url  : ${config.back_url} <br><br>
            userIp    : ${info.userIp} <br>
            browser   : ${info.browser} <br>
            os        : ${info.os} <br>
            platform  : ${info.platform} <br>
`,

        //${emailSignature}
        //`,
      },
      (error, emailInfo) => {
        if (error) {
          return log('emails').verbose({
            route: 'log.EmailTransport',
            message: error.black.bgRed,
            label: 'email_error',
          });
        }
        log('emails').verbose({
          message: `${info.level}_email sent to ${to}`.black.bgGrey,
          emailInfo,
          label: 'email_success',
        });
        // only needed when using pooled connections
        return transporter.close();
      },
    );
    // Perform the writing to the remote service
    //callback();
  }
}
