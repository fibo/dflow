
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

    // TODO per ora imposto sempre una funzione fittizia
    arg.task = function () { console.log('task'); }

    var node = new Node(arg);
    _nodes.push(node);

    return node;
  }

  self.delNode = function (id) {
  }
}

util.inherits(Graph, EventEmitter);

module.exports = Graph;

