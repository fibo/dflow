
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function In(arg) {
  var self = this;

  var edge;

  self.setEdge = function (newEdge) {
    edge = newEdge;
  }

}

In.prototype = {};

util.inherits(In, EventEmitter);

module.exports = In;


