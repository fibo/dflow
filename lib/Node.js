
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Node(arg) {
  var self = this;

  var task = arg.task;

  var ins = arg.ins;
  self.getIns = function () { return ins; }

  var outs = arg.outs;
  self.getOuts = function () { return outs; }

}

Node.prototype = {};

util.inherits(Node, EventEmitter);

module.exports = Node;

