#!/usr/bin/env node
const packagejson = require(`./package.json`);
const ip = require("ip");
const tColors = require('colors'); // color module to have colorful terminal, doesnt need to be loaded global
const appConfig=require(`./configs/app.config`)
require(`./utils/db`);//connect to db

/**
 * Module dependencies.
 */
var app = require('./app');
var debug = require('debug')('olympiagym-nodejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */
app.set('port', appConfig.backend.port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
if (appConfig.cluster > 0) {
  let cluster = require('cluster');
  if (cluster.isMaster) {
    console.log(`cluster is enabled. ${appConfig.cluster} cpus are in use`.black.bgBlue)
    // Create a worker for each CPU
    for (let c = 1; c <= appConfig.cluster; c++) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function () {
      console.log(`cluster exited`)
      cluster.fork();
    });

  } else {
    //launching the server
    server.listen(appConfig.backend.port, console.log(`******** ${packagejson.name} ${packagejson.version} http://${ip.address()}:${appConfig.backend.port}/ NODE_ENV=${appConfig.NODE_ENV} fork ${cluster.worker.id} pid ${cluster.worker.process.pid} ********`.black.bgBlue));
    server.on('error', onError);
    server.on('listening', onListening);
  }
} else {
  //launching the server without cluster
  server.listen(appConfig.backend.port, console.log(`******** ${packagejson.name} ${packagejson.version} http://${ip.address()}:${appConfig.backend.port}/ NODE_ENV=${appConfig.NODE_ENV} ********`.black.bgBlue));
  server.on('error', onError);
  server.on('listening', onListening);
}

server.setTimeout(0)//make sure timeout is disabled , wait forever


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}