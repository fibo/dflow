
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
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    self.setData(newSource.getData());
    source = newSource;
  }

}

In.prototype = {};

module.exports = In;

