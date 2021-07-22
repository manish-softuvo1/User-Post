const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

 db.user = require("./user");
 db.post = require("./post");

module.exports = db;