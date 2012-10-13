
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Edge(arg) {
  var self = this;

  var source = arg.source;
  self.getSource = function () { return source; }

  var target = arg.target;
  self.getTarget = function () { return target; }
}

Edge.prototype = {};

util.inherits(Edge, EventEmitter);

module.exports = Edge;


