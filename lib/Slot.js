
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Slot(arg) {
  var self = this;

  var data = arg.data;
  self.getData = function () { return data; }
  self.setData = function (newData) {
    if (typeof data == typeof newData) {

    }
  }
}

Slot.prototype = {};

util.inherits(Slot, EventEmitter);

module.exports = Slot;



