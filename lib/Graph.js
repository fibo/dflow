
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Graph(arg) {
  var self = this;

  var nodes = arg.nodes;
  self.getNodes = function () { return nodes; }

  var edges = arg.edges;
  self.getEdges = function () { return edges; }
}

Graph.prototype = {};

util.inherits(Graph, EventEmitter);

module.exports = Graph;

