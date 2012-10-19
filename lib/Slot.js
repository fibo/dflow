
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Slot(arg) {
  var self = this;

  try {
    if (!arg)      { throw Error; }
    if (!arg.data) { throw Error; }
    if (!arg.name) { throw Error; }
  }
  catch (err) {}

  var data = arg.data ;
  var type = typeof data;
  self.getData = function () { return data; }
  self.setData = function (newData) {
    if (typeof data == typeof newData) {

    }
  }
}

util.inherits(Slot, EventEmitter);

module.exports = Slot;

