/**
 * this file has the logging system
 * logging system written in seperate file to make it easy to integrates in other projects and to be extensible as possible
 */

const appRootPath = require('app-root-path');
const winston = require('winston'); //logging module
require('winston-mongodb');
const packagejson = require(`${appRootPath}/package.json`);
const tColors = require('colors/safe');
const appConfig = require(`../configs/app.config`)
const { mainMongo } = require(`../configs/mongo.config`)
const { errorHandler } = require('./error');


let log = exports.log = (params) => {
  //console.log(params,'log params')
  if (!params) params = {}

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
    mongo: {
      db: mainMongo.uri,
      options: {
        useUnifiedTopology: true
      },
      decolorize: true,
    }
  };
  console.log(); //to make terminal more readable

  return winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
      new winston.transports.MongoDB(options.mongo)
    ],
    exitOnError: false,
  })[params.level](params)
}

//stream are the output to console
//attached to morgan, express logger (app.js)
log.stream = {
  write: function (request, encoding) {
    let statusCode = request.slice(0, 1);
    if (statusCode == 2) {
      log({ level: 'debug', message: tColors.bgGreen(request.black) });
      console.log(); //to make console more readable
    } else if (statusCode == 3) {
      log({ level: 'debug', message: tColors.bgCyan(request.black) });
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
