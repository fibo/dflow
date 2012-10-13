
var Slot = require('./Slot.js');

function In(arg) {
  var self = this;

  Slot.call(self, arg);

  var data = arg.data;
  self.getData = function () { return data; }
  self.setData = function (newData) {
    if (typeof data == typeof newData) {

    }
  }

  var source;
  self.getSource = function () { return source; }

  self.setSource = function (newSource) {
    source = newSource;
  }

}

In.prototype = {};

module.exports = In;

