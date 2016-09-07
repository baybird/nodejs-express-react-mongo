
var mongo = require('mongoskin');

// Connect to MongoDB
var db = mongo.db("mongodb://localhost:/demo_db");
module.exports = db;

