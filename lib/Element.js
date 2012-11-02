
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var dflow = require('./Global.js');

function Element() {
  var self = this;

  var _id = dflow.addElement(self);

  self.getId = function () { return _id; }
}

util.inherits(Element, EventEmitter);

module.exports = Element;

