
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Edge = require('./Edge.js');

function Out(arg) {
  var self = this;

  var edge;

  self.getEdge = function () {
    var edge = new Edge();
    return edge;
  }

}

Out.prototype = {};

util.inherits(Out, EventEmitter);

module.exports = Out;

