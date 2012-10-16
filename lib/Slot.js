
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Slot(arg) {
  var self = this;

  try {
    if (!arg)      { throw Error; }
    if (!arg.data) { throw Error; }
    if (!arg.name) { throw Error; }
  }
  catch (err) {
    self.emit('ooops');
  }

// FIX inheritance and use prototype
self.toJSON = function(){return {};}

  var data = arg.data ;
  var type = typeof data;
  console.log(type);
  self.getData = function () { return data; }
  self.setData = function (newData) {
    if (typeof data == typeof newData) {

    }
  }
}

Slot.prototype = {
  toJSON: function () {
    return {
      data: this.getData()
    };
  }
};

util.inherits(Slot, EventEmitter);

module.exports = Slot;

