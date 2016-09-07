var express = require("express");
var app = express();

// Parse post paramaters. Contains key-value pairs of data submitted
// in the request body. By default, it is undefined, and is populated
// when you use body-parsing middleware such as body-parser and multer.
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


var es5Shim = require('es5-shim');
var es5Sham = require('es5-shim/es5-sham');
var consolePolyfill = require('console-polyfill');


// Static files
app.use(express.static('www'));

// Using socket.io
var server  = require('http').Server(app);
var io      = require('socket.io')(server);

// Using template engine
app.set('view engine', 'pug');


// Using routers
var router_work_api  = require('./router/work-api');
app.use('/api', router_work_api);

var router_page = require('./router/page');
app.use('/',router_page);


// Assign listen port
server.listen('80');

// Socket.io
io.on('connection', function (socket) {
  socket.join('room');

  socket.on('send_chat_message', function(msg){
    socket.broadcast.emit('send_chat_message', msg);// only sending to others except sender
  });
});


