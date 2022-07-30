var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const expressWinston = require('express-winston');
require('winston-mongodb');
const winston = require('winston'); //logging module
const loaders = require('./helpers/loaders')
const { mainMongo } = require(`./configs/mongo.config`)
const morganLogger = require(`./utils/morgan`)
const morganLoggerFormatted = morganLogger.formatToken()
const {log}=require(`./utils/log`)
var app = express();

// view engine setup
app.set('views', [`${__dirname}/src/`,`${__dirname}/src/index/views/`]);
app.set('view engine', 'ejs');
app.use(useragent.express());

app.use(expressWinston.logger({
  transports: [
    new winston.transports.MongoDB({
      db: mainMongo.uri,
      options: {
        useUnifiedTopology: true
      },
      decolorize: true,
    })
  ],
  expressFormat: true
}));


app.use(morganLoggerFormatted(`:status :method :url :nl *userIp=:userIp userId=:userId userEmail=:userEmail :nl *body=:body :nl *browser=:browser os=:os platform=:platform :nl *origin=:origin isBot=:isBot referrer=:referrer :nl responseTime=[*:response-time*]`,
  { stream: log.stream },
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

loaders.routes(app)//load routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
 // log({ level: 'debug', message: tColors.bgGreen(req.black) });
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
