
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Node = require('./Node.js');

function Graph(arg) {
  var self = this;

  arg |= {};

  var nodes = arg.nodes || [];
  self.getNodes = function () { return nodes; }

  self.addNode = function (arg) {
    arg.graph = self;
    var node = new Node(arg);
    nodes.push(node);
  }
}

Graph.prototype = {};

util.inherits(Graph, EventEmitter);

module.exports = Graph;

