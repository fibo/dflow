
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var newId = 0;

function Element() {
  var self = this;

  var _id = newId++;
  self.getId = function () { return _id; }
}

util.inherits(Element, EventEmitter);

module.exports = Element;

