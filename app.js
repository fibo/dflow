
/**
 * Module dependencies.
 */

var express = require('express');
var routes  = require('./routes');
var http    = require('http');
var path    = require('path');
var sio     = require('socket.io');

var app = express();

// Create process.dflow global object.
require('./index.js');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

//app.get('/graph/:id', routes.graph);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = sio.listen(server);

var doNothing = function () {}

var _socket = io.sockets.on('connection', function (socket) {
  socket.on('addNode', function (node) {
    // TODO sarebbe da mettere in un try, nel catch ci metto la notifica
    // al client che il nodo non e' stato creato.
    var _node = process.dflow.root.addNode(node);
    var _nodeToJSON = _node.toJSON();
    socket.broadcast.emit('addNode', _nodeToJSON);
    socket.emit('addNode', _nodeToJSON);
  });

  socket.on('disconnect', doNothing);
});

