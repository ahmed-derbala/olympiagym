const mongoose = require('mongoose');
const loaders = require('../helpers/loaders')
const { mainMongo } = require(`../configs/mongo.config`)


mongoose.connect(mainMongo.uri,mainMongo.options);
const db = mongoose.connection;

db.on('error', function () {
  console.error(`db_conn_error | ${mainMongo.name} | ${mainMongo.host}:${mainMongo.port}`.black.bgRed);
});

db.once('open', function () {
  console.log(`db_conn_success | ${mainMongo.name} | ${mainMongo.host}:${mainMongo.port}`.black.bgGreen);
});


