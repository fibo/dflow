
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Node = require('./Node.js');

function Graph(arg) {
  var self = this;

  var _arg = arg || {};

  var _nodes = _arg.nodes || [];
  self.getNodes = function () { return _nodes; }

  self.addNode = function (arg) {
    arg.graph = self;
    var node = new Node(arg);
    _nodes.push(node);
  }

  self.delNode = function (id) {
  }
}

//Graph.prototype = {};

util.inherits(Graph, EventEmitter);

module.exports = Graph;

