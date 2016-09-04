
var mongo = require('mongoskin');

var db = mongo.db("mongodb://localhost:/demo_db");
module.exports = db;

